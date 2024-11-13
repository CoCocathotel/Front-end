exports.convertFilesToBase64 = async (files) => {
    if (!files) return [];

    const fileReaders = files.map(file => {
        return new Promise((resolve, reject) => {
            if (file instanceof Blob) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            } else {
                resolve(file.url);
            }
        });
    });
    return await Promise.all(fileReaders);
};


exports.handleFileChange = async (info, fieldName, form) => {
    console.log("info",info,"filename",fieldName,"from",form," test function 13213451255221 ");
    const files = info.fileList.map(file => {
        if (file.originFileObj) {
            return file.originFileObj;
        } else if (file.url) {
            return file;
        }
        return null;
    }).filter(file => file !== null);

    form.setFieldsValue({ [fieldName]: files });
};