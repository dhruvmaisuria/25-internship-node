const roleModel = require("../models/RoleModel")
const getAllRoles = async(req,res)=>{
      const roles = await roleModel.find()
      res.json({
        message:"Role Fetched Successfully",
        data:roles
      });
};


const addRole = async(req,res) =>{

const savedRole = await roleModel.create(req.body)
  
  res.json({
    message:"role created..",
    data:savedRole
  })
}

const deleteRole = async(req,res)=>{

const deletedRole = await roleModel.findByIdAndDelete(req.params.id)
    
  res.json({
    message:"role deleted Successfully",
    data:deletedRole
  })
}

const updateRole = async(req,res)=>{

  const updatedRole = await roleModel.findByIdAndUpdate(req.params.id)
      
    res.json({
      message:"role updated Successfully",
      data:updateRole
    })
  }

const getRoleById = async(req,res)=>{

  const foundRole = await roleModel.findById(req.params.id)
  res.json({
    message:"role fetched...",
    data:foundRole
  })

}

module.exports ={
    getAllRoles,addRole,deleteRole,getRoleById,updateRole
}