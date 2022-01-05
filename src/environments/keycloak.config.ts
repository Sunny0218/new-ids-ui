import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig:KeycloakConfig = {
    // url:'https://auth.indoordronesystems.com/auth',
    url:'http://localhost:8080/auth',
    realm:'ids',
    clientId:'ids-android'

};

export default keycloakConfig;