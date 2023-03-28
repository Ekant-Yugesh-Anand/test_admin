import React, { useCallback, useEffect, useState } from "react";
import { MainContainer } from "../../../../components/layout";
import LanguageTab from "../../../../components/common/LanguageTab";
import { useQuery } from "@tanstack/react-query";
import { shopLanguages } from "../../../../http";
import { useParams } from "react-router-dom";
import { queryToStr } from "../../../../components/admin/utils";
import CoponLanguageContainer from "../../../../components/admin/master/Coupon/CouponLanguageContainer";
import {  shopCoupontranslation } from "../../../../http/server-api/server-apis";



const CouponLanguage = () => {
  const [language, setLanguage] = useState<any>({});
  const [productData, setProductData]= useState<any>({})
  const { data } = useQuery(["languages"], () => shopLanguages("get",{
    params:"languages"
  }), {
    refetchOnWindowFocus: false,
  });

  const { batch_name } = useParams();


 
  const languages = React.useMemo(() => {
    if (data?.status === 200) {
      setLanguage(data.data[0]);
      return data.data;
    }
    return [];
  }, [data]);

 

  const getCouponData = useCallback(async()=>{
    shopCoupontranslation("get", {
      postfix: "?".concat(
        queryToStr({ coupon_batch_name: batch_name,
          lang:language.lang_code
          })
      ),
    })?.then(res=>{
    if(res?.status){
      setProductData(res.data[0])
    }
    })

  },[language])

  useEffect(()=>{
  language &&  getCouponData()
  },[language])


  return (
    <MainContainer>
      {languages && (
        <LanguageTab
          lang={language || ""}
          ChangeLang={(lng) => setLanguage(lng)}
          languages={languages}  
        />
      )}

      {language && <CoponLanguageContainer language={language}  CouponData={productData || []}/>}

    </MainContainer>
  );
};

export default CouponLanguage;
