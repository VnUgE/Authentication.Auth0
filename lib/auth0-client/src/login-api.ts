// Copyright (c) 2023 Vaughn Nugent
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { useSession, useSessionUtils, WebMessage, useAxios } from '@vnuge/vnlib.browser'

export interface Auth0LoginApi {
    /**
     * Attempts to execute a user-login with the server for an Auth0 
     * oauth flow. This will redirect the user to the Auth0 login page
     * @returns Promise<void>
     */
    login: () => Promise<void>
    /**
     * Attempts to execute a user-logout with the server for an Auth0
     * oauth flow. This will redirect the user to the Auth0 logout page
     * @returns Promise<void>
     */
    logout: () => Promise<void>
}

/**
 * Creates a new Auth0 authentication api for executing Auth0 oauth flows
 * @param loginUrl The Auth0 plugin login path
 * @param logoutUrl The Auth0 plugin logout path
 * @returns A new Auth0LoginApi instance for executing Auth0 oauth flows
 */
export const useAuth0Login = (loginUrl: string, logoutUrl: string): Auth0LoginApi => {

    const { browserId, publicKey } = useSession()
    const { KeyStore } = useSessionUtils()
    const { put, post } = useAxios(null)

    const login = async () => {

        const { data } = await put<WebMessage<string>>(loginUrl, {
            browser_id: browserId.value,
            public_key: publicKey.value
        })

        const encDat = data.getResultOrThrow()
        // Decrypt the result which should be a redirect url
        const result = await KeyStore.decryptDataAsync(encDat)
        // get utf8 text
        const text = new TextDecoder('utf-8').decode(result)
        // Recover url
        const redirect = new URL(text)
        // Force https
        redirect.protocol = 'https:'
        // redirect to the url
        window.location.href = redirect.href
    }

    const logout = async (): Promise<void> => {
        const { data } = await post<WebMessage<string>>(logoutUrl, {})
        data.getResultOrThrow();
    }

    return {
        login,
        logout
    }
}