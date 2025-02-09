import axios from "axios";
import { LexicaTypes } from "../interfaces/ai/lexicaTypes";
import colors from "colors";
import { uploadImage } from "../libs/lexicaUpCloudinary";
import fs from "fs-extra";
import LexicaModel from "../models/lexicaM";

const searchPromptServices = async (
  promptQ: any,
  gridQ: boolean | undefined,
  nsfwQ: boolean,
  limit: any
) => {
  try {
    const url = `https://lexica.art/api/v1/search?q=${promptQ}`;
    // const url = `https://lexica.art/api/v1/search?q=`;
    const respuesta = await axios.get(url);
    let result = respuesta.data.images as LexicaTypes[];

    // const nsfwRes = result.filter((item) => item.nsfw === Boolean(nsfw));
    // const widthRes = result.filter((item) => item.width === Number(width));
    // const heightRes = result.filter((item) => item.height === Number(height));
    // const gridRes = result.filter((item) => item.grid === Boolean(grid));

    //Permitir las imagenes nsfw si el usuario lo desea
    // if (nsfwQ) {
    //   result = result.filter((item) => item.nsfw === nsfwQ);
    // }

    // if (limit) {
    //  return result = result.slice(0, Number(limit));
    // }

    // if([promptQ,width,height,grid,nsfw,guidance].includes(undefined)){
    //   return result
    // }
    colors.enable();
    console.log(`Resulto de la api: ${result.length}`.green);
    // console.log('hello'.green);

    if ([gridQ, nsfwQ].includes(undefined)) {
      // let error = new Error("grid or nsfw is undefined");

      return undefined;
    }
    // if ([gridQ, nsfwQ].includes(true)) {
    //   result = result.filter((item) => item.grid !== false);
    //   console.log('Entre en los dos true')
    // }
    // if ([gridQ, nsfwQ].includes(false)) {
    //   result = result.filter((item) => item.nsfw !== true);
    //   console.log('Entre en los dos false')
    // }

    if (nsfwQ === true && gridQ === false) {
      // result = result.filter((item) => item.nsfw === true);
      result = result.filter((item) => item.grid !== true);
      // result = result.filter((item) => item.nsfw !== false);q

      console.log(
        `entre en el NSFW true y GRID false ${result.length}`.magenta
      );
      return result.slice(0, Number(limit));
    }
    if (nsfwQ === false && gridQ === true) {
      result = result.filter((item) => item.nsfw !== true);
      // result = result.filter((item) => item.grid === true);
      // result = result.filter((item) => item.grid !== false);
      // result = result.filter((item) => item.grid === true);
      console.log(`entre en el NSFW false y GRID true ${result.length}`.yellow);
      return result.slice(0, Number(limit));
    }

    if (nsfwQ === true && gridQ === true) {
      // result = result.filter((item) => item.nsfw === true);
      // result = result.filter((item) => item.grid === true);
      // result = result.filter((item) => item.grid !== false);
      console.log(
        `entre en el NSFW true y GRID true resultaos ${result.length}`.cyan
      );

      return result.slice(0, Number(limit));
    }
    if (nsfwQ === false && gridQ === false) {
      result = result.filter((item) => item.nsfw !== true);
      result = result.filter((item) => item.grid !== true);
      console.log(
        `entre en el NSFW false y GRID false resultaos ${Number(result.length)}`
          .red
      );
      return result.slice(0, Number(limit));
    }

    //Permitir las imagenes nsfw y los grid si el usuario lo desea
    // if ([gridQ, nsfwQ].includes(true)) {
    //   result = result.filter(
    //     (item) => item.nsfw === nsfwQ && item.grid === gridQ
    //   );
    //   return result;
    // }
    // console.log("lleggooooo uno");

    // const finalMap = result.filter(
    //   (item) => item.grid === gridQ

    // item.width === Number(width) &&
    // item.height === Number(height) &&
    // item.grid === Boolean(grid)
    // );
    // .filter((item) => widthRes.includes(item))
    // .filter((item) => heightRes.includes(item))
    // .filter((item) => gridRes.includes(item));
    // if (!limit) {
    //   console.log('Llego al !limit');
    //   return result.slice(0, Number(limit));
    // } else {
    //   console.log('Llego al ultimo  else');
    //   return result;
    // }

    const finalResult = result.slice(0, Number(limit));
    console.log(finalResult.length);

    // console.log(finalResult.length + " " + limit);
    // console.log("lleggooooo dos");

    return finalResult;
  } catch (error) {
    const errorRes = new Error("you prompt is empty or invallid");
    return errorRes;
  }
};

const searchImgUplodedServices = async (files: any) => {
  try {
    let image;

    if (files?.imgUpload) {
      const result = await uploadImage(files.imgUpload.tempFilePath);
      await fs.remove(files.imgUpload.tempFilePath);
      image = {
        url: result.url,
        public_id: result.public_id,
      };
    }

    const url = `https://lexica.art/api/v1/search?q=${image?.url}`;
    console.log(url);
    const { data } = await axios.get(url);
    // console.log(data);
    const newLexica = new LexicaModel({
      image,
      data: data.images,
    });
    const newSave = await newLexica.save();
    // console.log(newSave);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const testUpload =async (file:any) => {
  console.log(file);
  return file
}

export { searchPromptServices, searchImgUplodedServices,testUpload };
