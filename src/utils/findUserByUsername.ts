import { AdminModel } from "../models/admin.model"

export default async function findUserByUsername(username: string) {
	const user = await AdminModel.findFirst({
		where: { username }
	})

	return user
}
