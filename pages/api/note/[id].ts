import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const id = req.query.id
    if(req.method == "DELETE") {
        try {
            const note = await prisma.note.delete({
                where:{
                  id: Number(id)  
                }
            })

            return res.status(200).json({'deleted': true, note})
        } catch (error) {
            console.log({'delete error': error})
            return res.status(500).json({'delete error': error})
        }
    }

}