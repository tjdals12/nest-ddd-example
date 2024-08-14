export class AccessLogDto {
    path: string;
    userId: string;
    date: Date;
    constructor(args: AccessLogDto) {
        this.path = args.path;
        this.userId = args.userId;
        this.date = args.date;
    }
}
