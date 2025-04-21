export class PageDto {

    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    data : any[];  

    constructor(page: number, limit: number, total: number, data: any[]) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.data = data;
        this.hasNextPage = (page + 1) * limit < total;
        this.hasPreviousPage = page > 0;
    }
}
