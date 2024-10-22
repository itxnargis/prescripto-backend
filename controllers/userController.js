import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUser = async (req, res) => {
      try {
            const { name, email, password } = req.body

            if (!name || !email || !password) {
                  return res.json({ success: false, meassage: "Missing Details" })
            }

            if (!validator.isEmail(email)) {
                  return res.json({ success: false, meassage: "Enter a valid email" })
            }

            if (password.length < 8) {
                  return res.json({ success: false, meassage: "Password should be of 8 characters" })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const userData = {
                  name,
                  email,
                  password: hashedPassword
            }

            const newUser = new userModel(userData)
            const user = await newUser.save()

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })

      } catch (error) {
            console.log(error)
            res.json({ success: false, message: error.message })
      }
}

const loginUser = async (req, res) => {
      try {

            const {email, password} = req.body
            const user = await userModel.findOne({email})

            if(!user) {
                 return res.json({ success: false, message: "User does not exists" })     
            }

            const isMatch = await bcrypt.compare(password, user.password)
            
            if(isMatch) {
                 const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
                  res.json({ success: true, token })
            }
            else {
                  res.json({success: false, message: "Invalid Credentials"})
            }

      } catch (error) {
            console.log(error)
            res.json({ success: false, message: error.message })    
      }
}

const getProfile = async (req,res) => {
      try {
            
      } catch (error) {
            
      }
}

export {registerUser, loginUser}