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

import { get } from '@vueuse/core'
import { type MaybeRef } from 'vue'
import { type OAuthMethod, type WebMessage } from '@vnuge/vnlib.browser'

/**
 * Creates a new Auth0 authentication api for executing Auth0 oauth flows
 * @param loginUrl The Auth0 plugin login path
 * @param logoutUrl The Auth0 plugin logout path
 * @returns A new Auth0LoginApi instance for executing Auth0 oauth flows
 */
export const useAuth0Login = (loginUrl: MaybeRef<string>, logoutUrl: MaybeRef<string>): OAuthMethod => {
    return {
        Id: 'auth0',
        
        loginUrl: () => get(loginUrl),

        //Set explicit logout data
        getLogoutData: () => ({ url: get(logoutUrl), args: {} }),

        onSuccessfulLogout(responseData: unknown) {
            (responseData as WebMessage<string>).getResultOrThrow();
        },
    }
}