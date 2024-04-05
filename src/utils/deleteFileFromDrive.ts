import { google } from "googleapis"
import path from "path"

const KEYFILEPATH = path.join(__dirname, "../credentials.json")
const SCOPES = ["https://www.googleapis.com/auth/drive"]

const auth = new google.auth.GoogleAuth({
	keyFile: KEYFILEPATH,
	scopes: SCOPES
})

const deleteFileFromDrive = async (fileId: string) => {
	const drive = google.drive({ version: "v3", auth })
	const id = fileId.split("id=")[1]

	try {
		await drive.files.delete({
			fileId: id
		})
		console.log(`File with ID ${id} deleted successfully.`)
	} catch (error: any) {
		console.error(`Error deleting file with ID ${id}: ${error.message}`)
	}
}

export default deleteFileFromDrive
