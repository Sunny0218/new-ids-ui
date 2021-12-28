import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig:KeycloakConfig = {
    url:'http://localhost:8080/auth',
    realm:'idsrealm',
    clientId:'idsClient'

};

export default keycloakConfig;