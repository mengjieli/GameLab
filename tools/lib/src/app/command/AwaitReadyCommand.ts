namespace lib {

    export class AwaitReadyCommand extends CallCommand {

        async execute() {
            var bool = (this.message as CallRequest).params.length ? (this.message as CallRequest).params[0] : true;
            // console.log("await?",bool);
            await StaticProxy.stateProxy.awaitReady(bool);
            // console.log("await!",bool);
            this.success();
        }
    }
}