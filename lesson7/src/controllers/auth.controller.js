const authController = {
  login: async (req, res) => {

    //login here
    
    res.status(200).json({
      message: "login successfully",
    });
  },
  register: async (req, res) => {
    res.status(200).json({
      message: "register successfully",
    });
  },
  
};

export default authController;