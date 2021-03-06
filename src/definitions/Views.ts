import * as ViewsDirectory from "../definitions/ViewsDirectory";
import {BotFrameworkActivity} from "./BotFrameworkService";
import {ResponseBody} from "./Common";
import {ResponseModel} from "./Handler";

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
    (model: ResponseModel, request?: BotFrameworkActivity): ResponseBody | Promise<ResponseBody>;
}