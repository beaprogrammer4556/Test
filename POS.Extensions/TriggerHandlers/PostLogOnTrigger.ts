import * as Triggers from "PosApi/Extend/Triggers/ApplicationTriggers";
export default class PostLogOnTrigger extends Triggers.PostLogOnTrigger {

    public async execute(options: Triggers.IPostLogOnTriggerOptions): Promise<void> {
        console.log("Megha-OK");
        console.log("Shantosh-OK");
        console.log("Saikat-OK");
        console.log("Debjit-OK");
        return Promise.resolve();
    }
}