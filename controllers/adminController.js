import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'

const addDoctor = async (req, res) => {
      try {
            const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
            const imageFile = req.file
            if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
                  return res.json({ success: false, message: "Missing Details" })
            }

            if (!imageFile) {
                  return res.json({ success: false, message: "Image file is required" });
            }

            if (!validator.isEmail(email)) {
                  return res.json({ success: false, message: "Please enter a valid email" })
            }

            if (password.length < 8) {
                  return res.json({ success: false, message: "Password should be of 8 character" })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageUrl = imageUpload.secure_url

            const doctorData = {
                  name,
                  email,
                  image: imageUrl,
                  password: hashedPassword,
                  speciality,
                  degree,
                  experience,
                  about,
                  fees,
                  address: address,
                  date: Date.now()
            }

            const newDoctor = new doctorModel(doctorData)
            await newDoctor.save()

            res.json({ success: true, message: "Doctor Added" })
      } catch (error) {
            console.log(error)
            res.json({ success: false, message: error.message })
      }
}

const loginAdmin = async (req, res) => {
      try {
            const { email, password } = req.body

            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                  const token = jwt.sign(email + password, process.env.JWT_SECRET)
                  res.json({ success: true, token })
            }
            else {
                  res.json({ success: false, message: "Invalid Credentials" })
            }
      } catch (error) {
            console.log(error)
            res.json({ success: false, message: error.message })
      }
}

const allDoctors = async (req, res) => {
      try {

            const doctors = await doctorModel.find({}).select('-password')
            res.json({ success: true, doctors })

      } catch (error) {
            console.log(error)
            res.json({ success: false, message: error.message })
      }
}

export { addDoctor, loginAdmin, allDoctors }