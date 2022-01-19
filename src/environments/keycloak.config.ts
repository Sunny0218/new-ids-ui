import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig:KeycloakConfig = {
    // url:'https://auth.indoordronesystems.com/auth',
    url:'https://ids.hdcircles.tech/auth',
    realm:'ids',
    clientId:'ids-front-end'

};

export default keycloakConfig;