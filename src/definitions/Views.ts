import {ResponseBody} from "./Common";
import {ResponseModel} from "./Handler";
let ViewsDirectory = require("../definitions/ViewsDirectory");

namespace Views {

    export class View {
        constructor(id: string, model: ResponseModel, render: RendersResponse) {
            this.id = id;
            this.model = model;
            this.render = render;

            ViewsDirectory[id] = this;
        }

        id: string;

        model: ResponseModel;

        render: RendersResponse;
    }

    export interface RendersResponse {
        (): ResponseBody | Promise<ResponseBody>;
    }
}

export = Views;