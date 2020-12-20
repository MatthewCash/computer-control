import { Model, Document, model, Schema } from 'mongoose';

declare interface SmartDeviceData extends Document {
    installedAppId: string;
    locationId: string;
    authToken: string;
    refreshToken: string;
    clientId: string;
    clientSecret: string;
    config: any;
}

export class SmartDeviceClass {
    private _model: Model<SmartDeviceData>;

    constructor() {
        const schema = new Schema(
            {
                installedAppId: {
                    type: String
                },
                locationId: {
                    type: String
                },
                authToken: {
                    type: String
                },
                refreshToken: {
                    type: String
                },
                clientId: {
                    type: String
                },
                clientSecret: {
                    type: String
                },
                config: {
                    type: Object
                }
            },
            {
                timestamps: true
            }
        );

        this._model = model<SmartDeviceData>('Data', schema);
    }

    public get model(): Model<SmartDeviceData> {
        return this._model;
    }
}

export const SmartDevice = new SmartDeviceClass().model;
