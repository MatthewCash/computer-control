import { Data } from './schema';

export class ContextStore {
    constructor() {}
    async get(installedAppId) {
        return Data.findOne({ installedAppId: installedAppId });
    }

    async put(params) {
        await Data.remove({ installedAppId: params.installedAppId });

        const data = new Data({
            installedAppId: params.installedAppId,
            locationId: params.locationId,
            authToken: params.authToken,
            refreshToken: params.refreshToken,
            clientId: params.clientId,
            clientSecret: params.clientSecret,
            config: params.config
        });

        await data
            .save()
            .then(data => {
                return { data };
            })
            .catch(error => {
                throw error;
            });

        return data;
    }

    async update(installedAppId, params) {
        const data = await Data.findOne({ installedAppId: installedAppId });
        data.authToken = params.authToken;
        data.refreshToken = params.refreshToken;
        data.save()
            .then(data => {
                return { data };
            })
            .catch(error => {
                throw error;
            });
    }

    async delete(installedAppId) {
        return Data.remove({ installedAppId: installedAppId });
    }
}
