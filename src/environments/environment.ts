const commonAppURI: string = 'http://localhost:8081/api/';
const commonAuth: string = 'http://localhost:8080/api/auth/';
const domaineUrl: string='localhost:4200'

export const environment = {
  production: false,
  domaine:`${domaineUrl}`,
  recordsPerPage: 20,

  // detachementUrl: 'http://10.53.218.146:8081/api',
  detachementUrl: 'http://localhost:8081/api',
  authentificationUrl: 'http://localhost:8080/api/auth',

  circuitUrl:commonAppURI + 'circuit',
  communeUrl: commonAppURI +'communes',
  pieceUrl: commonAppURI +'pieces',
  articleUrl: commonAppURI +'articles',
  corpsUrl: commonAppURI +'corps',
  provinceUrl: commonAppURI +'provinces',
  typesPieceUrl: commonAppURI +'type-pieces',
  typesAssureUrl: commonAppURI +'type-assures',
  resourceUrl: commonAppURI +'taux-forfait-cotisations',
  tauxCotisationUrl: commonAppURI +'taux-forfait-cotisations',
  divisionUrl: commonAppURI +'divisions',
  sectionUrl : commonAppURI +'sections',
  secteurActiviteUrl: commonAppURI +'secteur-activites',
  secteurVillageUrl: commonAppURI +'secteur-villages',
  userUrl: commonAuth +'register',
  profilUrl: commonAuth +'profils',
  privilegeUrl: commonAuth +'privileges',
  authResource: commonAuth +'authenticate',
  accountResource: commonAuth +'utilisateurs/validate',
  visaUrl: commonAuth + 'visas',
  motifUrl: commonAppURI + 'motifs',
  ministereUrl: commonAuth + 'ministeres',
  ampliationUrl:commonAuth + 'ampliations',
  demandeUrl:commonAppURI + 'demandes',
   // typeEmployeurUrl: commonAppURI +'typeEmployeur',


  //typesCotisationUrl:commonAppCOT+'type-cotisations',
  arrondissementUrl: commonAppURI +'arrondissements',


  //tauxCotisationUrl: commonAppURI +'taux-cotisations',
  // regionUrl: commonAppURI +'regions ',
  // province: commonAppURI +'province ',
  // situationMatrimonial: commonAppURI +'situation-matrimoniale ',
  // affiliation: commonAppURI +'employeurs',
  categorieEmployeurUrl: commonAppURI +'categorieemployeurs',
  // banqueUrl: commonAppURI +'banque ',
  // caisseUrl: commonAppURI +'caisse ',
  // paysUrl: commonAppURI +'pays ',
  // roleUrl: commonAppURI +'role ',
  // typesCotisationUrl:commonAppURI+'types-cotisations',


  formesJuridique: commonAppURI +'formes-juridiques ',
  // situationMatrimonialeUrl: commonAppURI +'situation-matrimoniales ',
  //secteurVillage: commonAppURI +'secteur-villages ',

  regionUrl: commonAppURI +'regions',
  province: commonAppURI +'province',
  banqueUrl: commonAppURI +'banques',

  // caisseUrl: commonAppCOT +'caisses',

  paysUrl: commonAppURI +'pays',
  roleUrl: commonAppURI +'role',


  formesJuridiqueUrl: commonAppURI +'forme-juridiques',
  fournisseurURL: commonAppURI + "fournisseurs",

  situationMatrimonial: commonAppURI +'situation-matrimoniale',
  affiliation: commonAppURI +'employeurs',
  affiliationValider: commonAppURI +'valider',
  tAssureTCotisationUrl: commonAppURI+ 'tassure-tcotisation',

  tAssureTCotisation:commonAppURI+ 'tassure-tcotisation',
  situationMatrimonialeUrl: commonAppURI +'situation-matrimoniales',
  classeUrl: commonAppURI +'classe',
  activiteUrl: commonAppURI +'activites',

  groupeURL: commonAppURI +'groupes',

  entreeSortieUrl: commonAppURI +'entree-sorties',


  typeEmployeurUrl: commonAppURI +'type-employeurs',
  emploiUrl: commonAppURI+'emplois',
  professionUrl: commonAppURI+'professions ',


  //pays: commonAppURI +'pays ',
  region: commonAppURI +'regions',
  //resourceUrl: commonAppURI +'taux-forfait-cotisations',
  //sectionUrl: commonAppURI +'sections',

  assureUrl: commonAppURI +'assures',
  dashbordUrl : commonAppURI+'reports',

  // tauxCotisationUrl: '',
 //  entreeSortieUrl: commonAppURI +'entreeSorties',
  declaration: commonAppURI+ 'declarations',
  employeur: commonAppURI+ 'employeurs',
  tauxByTypeEmployeurUrl: commonAppURI+ 'taux-type-employeur',
  tauxByTypeAssureUrl: commonAppURI+ 'taux-type-assure',
  resourceUploadFile: commonAppURI+ 'file/upload',
  resourceRetrieveFile: commonAppURI+ 'file/recuperer',
  resourceListeAssureByDeclaration: commonAppURI + 'declarations-Assure',
  typeActeGeneratedUrl: commonAppURI + 'type-actes-generes',
  signataireUrl: commonAppURI + 'signataires',

  // === reporting, statistiques === //
  reportingUrl: commonAppURI +'reports',




  authorize_uri: 'http://localhost:9000/oauth2/authorize?',
  client_id : 'client',
  redirect_uri: 'http://localhost:4200/authorized',
  scope: 'openid',
  response_type: 'code',
  response_mode: 'form_post',
  code_challenge_method: 'S256',
  token_url: 'http://localhost:9000/oauth2/token',
  grant_type: 'authorization_code',
  resource_url: 'http://localhost:8080/resource/',
  logout_url: 'http://localhost:9000/oauth2/logout',
  secret_pkce: 'secret'

};
/****** */
