/*
* Copyright (c) 2023 Vaughn Nugent
* 
* Library: VNLib
* Package: VNLib.Plugins.Essentials.Authentication.Auth0
* File: Auth0Entry.cs 
*
* Auth0Entry.cs is part of VNLib.Plugins.Essentials.Authentication.Auth0 which 
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


using VNLib.Utils.Logging;
using VNLib.Plugins.Extensions.Loading;
using VNLib.Plugins.Extensions.Loading.Routing;
using VNLib.Plugins.Essentials.Authentication.Auth0.Endpoints;

namespace VNLib.Plugins.Essentials.Authentication.Auth0
{

    /// <summary>
    /// 
    /// </summary>
    public sealed class Auth0Entry : PluginBase
    {
        ///<inheritdoc/>
        public override string PluginName => "Authentication.Auth0";

        ///<inheritdoc/>
        protected override void OnLoad()
        {
            if (this.HasConfigForType<LoginEndpoint>())
            {
                //Add the auth0 login endpoint
                this.Route<LoginEndpoint>();
                Log.Information("Auth0 authentication loaded");
            }

            //Init logout endpoint
            if(this.HasConfigForType<LogoutEndpoint>())
            {
                this.Route<LogoutEndpoint>();
                Log.Information("Auth0 logout endpoint loaded");
            }

            Log.Information("Plugin loaded");
        }

        ///<inheritdoc/>
        protected override void OnUnLoad()
        {
            Log.Information("Plugin unloaded");
        }

        ///<inheritdoc/>
        protected override void ProcessHostCommand(string cmd)
        {
            throw new System.NotImplementedException();
        }
    }
}