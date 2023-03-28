import { FileUploader as ReactFileUploader } from "react-drag-drop-files";
import useBucket from "../../../../hooks/useBucket";
import React from "react"
import axios from "axios"
const MultipleImageUpload =() =>{
    const { imgUploader } = useBucket();
    const [bulkImg, setBulkImg] = React.useState({});
    const [uploadResponse, setUploadResponse] = React.useState<{
      prevImg?: any;
      res?: {
        status?: string;
        image?: string;
      };
      err?: unknown;
    }[]>([]);
return(
    <>
    
    <input type="file" multiple onChange={
        async (event: React.ChangeEvent<HTMLInputElement>) => {
          const { files } = event.target
          files && setBulkImg(files)
          if (files) {
            const response = []

            for (let i = 0; i < files?.length; i++) {
              const imgName = files[i].name
          

              try {
                const res = await imgUploader(files[i]);


                if (res.status === "success") {

                  const config = {
                    headers: {
                      Authorization: process.env.REACT_APP_AUTHORIZATION_TOKEN
                    }
                  }
                  const body = {
                    sku_code:imgName.split(".")[0], 
                    image_url:res.image
                  }

                  axios.post(`${process.env.REACT_APP_BASE_URL}/shop_products/update_image`, body, config).then(res => {
                    console.log(res.data)
                  })
                  response.push({
                    prevImg: imgName,
                    res: res
                  })

                }
              } catch (err) {
                response.push({
                  prevImg: imgName,
                  err: err
                })

              }
            }

            setUploadResponse(response)
          }

        }
      } />

      <button type="submit" name="response"  > View Resoponse </button>

      {
        uploadResponse && uploadResponse.map(uplodData => {
          return <div>

            <p>{uplodData.prevImg}</p>
            {uplodData.res?.status == "success" ? <p>{uplodData.res?.image}</p> : <p>Image could not uploaded</p>}
          </div>
        })
      }
    </>
)
}
export default MultipleImageUpload