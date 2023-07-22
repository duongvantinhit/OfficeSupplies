import { environment } from 'src/app/environments/environment';

export class EndpointUri {
    static readonly Auth = `${environment.apiBaseURI}/auth`;
    static readonly OfficeSupplies = `${environment.apiBaseURI}/OS`;
}
