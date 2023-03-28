import React, { useCallback, useEffect, useState } from "react";
import { MainContainer } from "../../../../components/layout";
import LanguageTab from "../../../../components/common/LanguageTab";
import LanguageContainer from "../../../../components/admin/products/productLanguage/LanguageContainer";
import { useQuery } from "@tanstack/react-query";
import { shopLanguages, shopProductDetails } from "../../../../http";
import { useParams } from "react-router-dom";
import { queryToStr } from "../../../../components/admin/utils";



const ProductLanguage = () => {
  const [language, setLanguage] = useState<any>({});
  const [productData, setProductData]= useState<any>({})
  const { data } = useQuery(["languages"], () => shopLanguages("get",{
    params:"languages"
  }), {
    refetchOnWindowFocus: false,
  });

  const { sku_id } = useParams();


 
  const languages = React.useMemo(() => {
    if (data?.status === 200) {
      setLanguage(data.data[0]);
      return data.data;
    }
    return [];
  }, [data]);

 

  const getProductData = useCallback(async()=>{
    shopProductDetails("get", {
      postfix: "?".concat(
        queryToStr({ sku_id,
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
  language &&  getProductData()
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

      {language && <LanguageContainer language={language}  ProductData={productData}/>}

    </MainContainer>
  );
};

export default ProductLanguage;
