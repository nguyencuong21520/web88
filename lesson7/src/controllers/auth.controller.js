const authController = {
  login: async (req, res) => {

    //login here
    
    res.status(200).json({
      message: "login successfully",
    });
  },
  register: async (req, res) => {
    const {name, email, password} = req.body;

    //check if user already exists
    const currentUser = await User.findOne({email})
    if(currentUser){
      return res.status(400).json({
        message: "User already exists",
      });
    }
    //create new user

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role: "user",
      salt
    })
    
    

    res.status(200).json({
      message: "register successfully",
      user: newUser
    });
  },
  
};

export default authController;