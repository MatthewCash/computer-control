import { SmartDevice } from './schema';

export class ContextStore {
    constructor() {}
    async get(installedAppId) {
        return SmartDevice.findOne({ installedAppId: installedAppId });
    }

    async put(params) {
        await SmartDevice.remove({ installedAppId: params.installedAppId });

        const data = new SmartDevice({
            installedAppId: params.installedAppId,
            locationId: params.locationId,
            authToken: params.authToken,
            refreshToken: params.refreshToken,
            clientId: params.clientId,
            clientSecret: params.clientSecret,
            config: params.config
        });

        return data.save();
    }

    async update(installedAppId, params) {
        const data = await SmartDevice.findOne({
            installedAppId: installedAppId
        });

        data.authToken = params.authToken;
        data.refreshToken = params.refreshToken;

        return data.save();
    }

    async delete(installedAppId) {
        return SmartDevice.remove({ installedAppId: installedAppId });
    }
}
