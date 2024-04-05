import stream from "stream"
import { google } from "googleapis"
import { CREDENTIALS } from "./credentials"

const SCOPES = ["https://www.googleapis.com/auth/drive"]

const auth = new google.auth.GoogleAuth({
	credentials: CREDENTIALS,
	scopes: SCOPES
})

const uploadFile = async (fileObject: any) => {
	const bufferStream = new stream.PassThrough()
	bufferStream.end(fileObject.buffer)
	const { data } = await google.drive({ version: "v3", auth }).files.create({
		media: {
			mimeType: fileObject.mimetype,
			body: bufferStream
		},
		requestBody: {
			name: fileObject.originalname,
			parents: ["1OKMTmXOm9JjaJx7RPXgfeFnmxYR2jidf"]
		},
		fields: "id,name"
	})
	console.log(
		`Uploaded file ${data.name} with id: ${data.id}, webViewLink: https://drive.google.com/uc?id=${data.id}`
	)
	return data
}

const uploadFileToDrive = async (file: any) => {
	try {
		const data = await uploadFile(file)

		console.log(`File with ID ${data.id} uploaded successfully.`)
		return data
	} catch (error: any) {
		console.error(`Error uploading file: ${error.message}`)
	}
}

export default uploadFileToDrive
