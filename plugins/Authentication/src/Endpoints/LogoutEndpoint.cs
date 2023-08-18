/*
* Copyright (c) 2023 Vaughn Nugent
* 
* Library: VNLib
* Package: VNLib.Plugins.Essentials.Authentication.Auth0
* File: LogoutEndpoint.cs 
*
* LogoutEndpoint.cs is part of VNLib.Plugins.Essentials.Authentication.Auth0 which 
* is part of the larger VNLib collection of libraries and utilities.
*
* VNLib.Plugins.Essentials.Authentication.Auth0 is free software: you can 
* redistribute it and/or modify it under the terms of the GNU Affero 
* General Public License as published by the Free Software Foundation, 
* either version 3 of the License, or (at your option) any later version.
*
* VNLib.Plugins.Essentials.Authentication.Auth0 is distributed in the hope 
* that it will be useful, but WITHOUT ANY WARRANTY; without even the implied 
* warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/

using System.Collections.Generic;

using VNLib.Utils;
using VNLib.Plugins.Extensions.Loading;
using VNLib.Plugins.Essentials.Accounts;
using VNLib.Plugins.Essentials.Endpoints;
using VNLib.Plugins.Essentials.Extensions;


namespace VNLib.Plugins.Essentials.Authentication.Auth0.Endpoints
{
    [ConfigurationName("logout")]
    internal sealed class LogoutEndpoint : ProtectedWebEndpoint
    {
        private readonly IAsyncLazy<string> ReturnUrl;

        public LogoutEndpoint(PluginBase plugin, IConfigScope config)
        {
            string returnToUrl = config["return_to_url"].GetString() ?? throw new KeyNotFoundException("Missing required configuration key 'return_to_url'");
            string logoutUrl = config["logout_url"].GetString() ?? throw new KeyNotFoundException("Missing required configuration key 'logout_url'");

            //Build the return url once the client id is available
            ReturnUrl = plugin.GetSecretAsync("auth0_client_id").ToLazy(sr =>
            {
                return $"{logoutUrl}?client_id={sr.Result.ToString()}&returnTo={returnToUrl}";
            });
        }

        protected override ERRNO PreProccess(HttpEntity entity)
        {
            //Client required to be fully authorized
            return base.PreProccess(entity)
                && entity.IsClientAuthorized(AuthorzationCheckLevel.Critical);
        }

        protected override VfReturnType Post(HttpEntity entity)
        {
            //Invalidate the login before redirecting the client
            entity.InvalidateLogin();
            entity.Redirect(RedirectType.Temporary, ReturnUrl.Value);
            return VfReturnType.VirtualSkip;
        }
    }
}