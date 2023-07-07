import aws from "aws-sdk"
// const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION } = process.env
// console.log(ACCESS_KEY_ID);
// aws.config.update({
//     accessKeyId: ACCESS_KEY_ID,
//     secretAccessKey: SECRET_ACCESS_KEY,
//     region: REGION
// })
aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

export const uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        const s3 = new aws.S3({ apiVersion: '2006-03-01' })

        const uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }

        s3.upload(uploadParams, function (error, data) {
            if (error) {
                return reject({ "error": error })
            }
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })

    })
}