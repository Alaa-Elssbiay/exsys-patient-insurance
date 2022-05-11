/*
 *
 * apiIds: `@exsys-clinio/api-constants`.
 *
 */
const API_IDS = {
  // http://207.180.237.36:9090/ords/exsys_api/ex_web_patient_booking/web_clinical_specialities?authorization=2878756&planguageid=1
  QUERY_CLINICAL_SPECIALITIES_LIST:
    "ex_web_patient_booking/web_clinical_specialities",
  //  http://207.180.237.36:9090/ords/exsys_api/ex_web_patient_booking/web_clinical_list?authorization=3524880&planguageid=1&specialty_no=2&period_type=N
  QUERY_CLINICAL_LIST: "ex_web_patient_booking/web_clinical_list",
  // http://207.180.237.36:9090/ords/exsys_api/ex_web_patient_booking/web_doctor_session?authorization=3524880&planguageid=1&clinical_entity_no=1&poffset=0&period_type=N&slotsPerOffset=4
  QUERY_SESSIONS_BY_CLINICAL_ENTITY_NO:
    "ex_web_patient_booking/web_doctor_session",
};

export default API_IDS;
