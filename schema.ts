import { Model, Document, model, Schema } from 'mongoose';

declare interface ModelData extends Document {
    installedAppId: string;
    locationId: string;
    authToken: string;
    refreshToken: string;
    clientId: string;
    clientSecret: string;
    config: any;
}

export class DataClass {
    private _model: Model<ModelData>;

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

        this._model = model<ModelData>('Data', schema);
    }

    public get model(): Model<ModelData> {
        return this._model;
    }
}

export const Data = new DataClass().model;
