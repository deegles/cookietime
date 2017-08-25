import {ResponseBody} from "./Common";
import {ResponseModel} from "./Handler";
let ViewsDirectory = require("../definitions/ViewsDirectory");

namespace Views {

    export class View {
        constructor(id: string, render: RendersResponse) {
            this.id = id;
            this.render = render;

            ViewsDirectory[id] = this;
        }

        id: string;

        render: RendersResponse;
    }

    export interface RendersResponse {
        (model: ResponseModel): ResponseBody | Promise<ResponseBody>;
    }
}

export = Views;