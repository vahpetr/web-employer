interface IMediator {
    broadcast(name: string)
    broadcast(name: string, arg: any)
    broadcast(name: string, args: any[])
}

declare var mediator: IMediator;

declare module "mediator" {
	export = mediator;
}