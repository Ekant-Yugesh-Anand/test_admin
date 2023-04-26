export function emptyText(label: string): string {
  return `${label} is not allowed to be empty`;
}

export function minText(label: string): string {
  return `${label} must be at least 2 characters`;
}

export function getStrOrderStatus(status: string) {
  const value: Record<string | number, string> = {
    0: "New",
    1: "Accepted",
    2: "In Process",
    3: "In Process",
    4: "Out For Delivery",
    5: "Delivered",
    6: "Return from farmer",
    7: "Cancel from farmer",
    8: "Return in process",
    9: "Cancel from retailer",
    10: "Cancel from manager/agent",
    11: "Cancel return",
    12: "Return in process",
    13: "Cancel return",
    14: "Return in process",
    15: "Cancel return",
    16: "Return in process",
    17: "Returned",
    18: "Refunded",
    "11,13,15": "Cancel return",
    "2,3": "In Process",
    "9,10": "Rejected",
    "7,9,10": "Cancelled"
  };
  // const key = status instanceof Array ? status.join(",") : status;
  return value[status];
}

const states= [
  {
    "name": "Andaman And Nicobar Islands",
    "centroid": "11.25618503004921,92.9532033232864",
    "id": 1,
    "code": 35,
    "language_code": "hi",
    "subdistrict_type": "tehsil",
    "name_kn": "ಅಂಡಮಾನ್ ಮತ್ತು ನಿಕೋಬಾರ್ ದ್ವೀಪಗಳು"
  },
  {
    "name": "Andhra Pradesh",
    "centroid": "15.753681634335035,79.96286945582739",
    "id": 2,
    "code": 28,
    "language_code": "te",
    "subdistrict_type": "mandal",
    "name_kn": "ಆಂಧ್ರಪ್ರದೇಶ"
  },
  {
    "name": "Arunachal Pradesh",
    "centroid": "28.035674418889442,94.69707434360707",
    "id": 3,
    "code": 12,
    "language_code": "en",
    "subdistrict_type": "circle",
    "name_kn": "ಅರುಣಾಚಲ ಪ್ರದೇಶ"
  },
  {
    "name": "Assam",
    "centroid": "26.35672133744645,92.82670857515296",
    "id": 4,
    "code": 18,
    "language_code": "as",
    "subdistrict_type": "sub-division",
    "name_kn": "ಅಸಮ"
  },
  {
    "name": "Bihar",
    "centroid": "25.679185336118287,85.61027490545028",
    "id": 5,
    "code": 10,
    "language_code": "hi",
    "subdistrict_type": "sub-division",
    "name_kn": "ಬಿಹಾರ"
  },
  {
    "name": "Chandigarh",
    "centroid": "30.72940797119423,76.7805971026879",
    "id": 6,
    "code": 4,
    "language_code": "en",
    "subdistrict_type": "sub-division",
    "name_kn": "ಚಂಡೀಗಢ"
  },
  {
    "name": "Chhattisgarh",
    "centroid": "21.26626133839632,82.04076121115267",
    "id": 7,
    "code": 22,
    "language_code": "hi",
    "subdistrict_type": "tehsil",
    "name_kn": "ಛತ್ತೀಸ್‌ಗಢ"
  },
  {
    "name": "Dadra And Nagar Haveli And Daman And Diu",
    "centroid": "20.24941311340675,72.92956862245693",
    "id": 8,
    "code": 38,
    "language_code": "hi",
    "subdistrict_type": "taluka",
    "name_kn": "ದಾದ್ರಾ ಮತ್ತು ನಗರ ಹವೇಲಿ ಮತ್ತು ದಮನ್ ಮತ್ತು ದಿಯು"
  },
  {
    "name": "Delhi",
    "centroid": "28.64407754140845,77.11497066419761",
    "id": 9,
    "code": 7,
    "language_code": "hi",
    "subdistrict_type": "tehsil",
    "name_kn": "ದೆಹಲಿ"
  },
  {
    "name": "Goa",
    "centroid": "15.36373558839875,74.0539727130893",
    "id": 10,
    "code": 30,
    "language_code": "gom",
    "subdistrict_type": "taluka",
    "name_kn": "ಗೋವಾ"
  },
  {
    "name": "Gujarat",
    "centroid": "22.692650915011605,71.59227820212757",
    "id": 11,
    "code": 24,
    "language_code": "gu",
    "subdistrict_type": "taluka",
    "name_kn": "ಗುಜರಾತ್"
  },
  {
    "name": "Haryana",
    "centroid": "29.19800509556664,76.3397212744074",
    "id": 12,
    "code": 6,
    "language_code": "hi",
    "subdistrict_type": "tehsil",
    "name_kn": "ಹರಿಯಾಣ"
  },
  {
    "name": "Himachal Pradesh",
    "centroid": "31.925704486398818,77.24308427660199",
    "id": 13,
    "code": 2,
    "language_code": "hi",
    "subdistrict_type": "tehsil",
    "name_kn": "ಹಿಮಾಚಲ ಪ್ರದೇಶ"
  },
  {
    "name": "Jammu And Kashmir",
    "centroid": "33.56162577177315,75.10808776472776",
    "id": 14,
    "code": 1,
    "language_code": "ks,ks-deva",
    "subdistrict_type": "tehsil",
    "name_kn": "ಜಮ್ಮು ಮತ್ತು ಕಾಶ್ಮೀರ"
  },
  {
    "name": "Jharkhand",
    "centroid": "23.655604105553977,85.5634762026661",
    "id": 15,
    "code": 20,
    "language_code": "hi",
    "subdistrict_type": "sub-division",
    "name_kn": "ಜಾರ್ಖಂಡ್"
  },
  {
    "name": "Karnataka",
    "centroid": "14.710103649194155,76.16754585510704",
    "id": 16,
    "code": 29,
    "language_code": "kn",
    "subdistrict_type": "taluka",
    "name_kn": "ಕರ್ನಾಟಕ"
  },
  {
    "name": "Kerala",
    "centroid": "10.451881256013953,76.40742677669542",
    "id": 17,
    "code": 32,
    "language_code": "ml",
    "subdistrict_type": "taluk",
    "name_kn": "ಕೇರಳ"
  },
  {
    "name": "Ladakh",
    "centroid": "33.96953082519633,77.57162571248475",
    "id": 18,
    "code": 37,
    "language_code": "hi",
    "subdistrict_type": "tehsil",
    "name_kn": "ಲಡಾಖ್"
  },
  {
    "name": "Lakshadweep",
    "centroid": "10.455189723195915,72.75791450267104",
    "id": 19,
    "code": 31,
    "language_code": "ml",
    "subdistrict_type": "sub-division",
    "name_kn": "ಲಕ್ಷದ್ವೀಪ"
  },
  {
    "name": "Madhya Pradesh",
    "centroid": "23.538425883688284,78.28919363459849",
    "id": 20,
    "code": 23,
    "language_code": "hi",
    "subdistrict_type": "tehsil",
    "name_kn": "ಮಧ್ಯಪ್ರದೇಶ"
  },
  {
    "name": "Maharashtra",
    "centroid": "19.451892787154144,76.10930883263177",
    "id": 21,
    "code": 27,
    "language_code": "mr",
    "subdistrict_type": "taluka",
    "name_kn": "ಮಹಾರಾಷ್ಟ್ರ"
  },
  {
    "name": "Manipur",
    "centroid": "24.735446295808213,93.87973315283612",
    "id": 22,
    "code": 14,
    "language_code": "mni",
    "subdistrict_type": "sub-division",
    "name_kn": "ಮಣಿಪುರ"
  },
  {
    "name": "Meghalaya",
    "centroid": "25.534846609096643,91.27673384207176",
    "id": 23,
    "code": 17,
    "language_code": "en",
    "subdistrict_type": "sub-division",
    "name_kn": "ಮೇಘಾಲಯ"
  },
  {
    "name": "Mizoram",
    "centroid": "23.30828043005565,92.8322461237727",
    "id": 24,
    "code": 15,
    "language_code": "en",
    "subdistrict_type": "sub-division",
    "name_kn": "ಮಿಜೋರಾಂ"
  },
  {
    "name": "Nagaland",
    "centroid": "26.063432750883763,94.46714534467995",
    "id": 25,
    "code": 13,
    "language_code": "en",
    "subdistrict_type": "circle",
    "name_kn": "ನಾಗಾಲ್ಯಾಂಡ್"
  },
  {
    "name": "Odisha",
    "centroid": "20.51182625535626,84.4260444843181",
    "id": 26,
    "code": 21,
    "language_code": "or",
    "subdistrict_type": "tehsil",
    "name_kn": "ಒಡಿಶಾ"
  },
  {
    "name": "Puducherry",
    "centroid": "11.861310889668237,79.82109416678041",
    "id": 27,
    "code": 34,
    "language_code": "ta",
    "subdistrict_type": "commune panchayat",
    "name_kn": "ಪುದುಚೇರಿ"
  },
  {
    "name": "Punjab",
    "centroid": "30.84253079757351,75.41505960840283",
    "id": 28,
    "code": 3,
    "language_code": "pa,pa-guru",
    "subdistrict_type": "tehsil",
    "name_kn": "ಪಂಜಾಬ್"
  },
  {
    "name": "Rajasthan",
    "centroid": "26.58447486161458,73.84963908568312",
    "id": 29,
    "code": 8,
    "language_code": "hi",
    "subdistrict_type": "tehsil",
    "name_kn": "ರಾಜಾಸ್ಥಾನ"
  },
  {
    "name": "Sikkim",
    "centroid": "27.5701767871713,88.47267031548914",
    "id": 30,
    "code": 11,
    "language_code": "en",
    "subdistrict_type": "sub-division",
    "name_kn": "ಸಿಕ್ಕಿಂ"
  },
  {
    "name": "Tamil Nadu",
    "centroid": "11.014653536672183,78.40835342477767",
    "id": 31,
    "code": 33,
    "language_code": "ta",
    "subdistrict_type": "taluka",
    "name_kn": "ತಮಿಳುನಾಡು"
  },
  {
    "name": "Telangana",
    "centroid": "17.801379457797882,79.0086276154178",
    "id": 32,
    "code": 36,
    "language_code": "te",
    "subdistrict_type": "mandal",
    "name_kn": "ತೆಲಂಗಾಣ"
  },
  {
    "name": "Tripura",
    "centroid": "23.74559896586595,91.74154853453044",
    "id": 33,
    "code": 16,
    "language_code": "en",
    "subdistrict_type": "sub-division",
    "name_kn": "ತ್ರಿಪುರಾ"
  },
  {
    "name": "Uttarakhand",
    "centroid": "30.156971518694636,79.20632461899632",
    "id": 35,
    "code": 5,
    "language_code": "hi",
    "subdistrict_type": "tehsil",
    "name_kn": "ಉತ್ತರಾಖಂಡ"
  },
  {
    "name": "Uttar Pradesh",
    "centroid": "26.923735771726662,80.56537469348173",
    "id": 34,
    "code": 9,
    "language_code": "hi",
    "subdistrict_type": "tehsil",
    "name_kn": "ಉತ್ತರ ಪ್ರದೇಶ"
  },
  {
    "name": "West Bengal",
    "centroid": "23.81138380196122,87.98325096181057",
    "id": 36,
    "code": 19,
    "language_code": "bn",
    "subdistrict_type": "sub-division",
    "name_kn": "ಪಶ್ಚಿಮ ಬಂಗಾಳ"
  }
]

export function getPos(stateName: string) {
  let pos:string | number = ""
  for(let i in states){
    states[i].name == stateName
    pos = states[i].code
  }
  return pos
}



