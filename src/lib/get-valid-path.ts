import fsa from "fs-extra";

export const getValidPath = async (path: string, extensions: string[]): Promise<string | null> => {
  const fileExtension = path.split(".").at(-1);

  if (!fileExtension) {
    throw "path argument should be a path of a file instead of a dir";
  }

  const subpath = path.substring(0, path.length - (fileExtension?.length + 1));

  const validFileExtensions = await Promise.all(
    extensions.map((mimetype) => {
      return fsa.exists(subpath + "." + mimetype);
    })
  );

  const validFileExtensionIndex = validFileExtensions.findIndex(
    (isSuccess) => isSuccess
  );

  if(validFileExtensionIndex === -1) {
    return null;
  }

  const validFileExtension = extensions[validFileExtensionIndex];

  return subpath + "." + validFileExtension;
};
