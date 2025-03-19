const queryModel = require("../models/QueriesModel")
const getAllQueries = async(req,res)=>{
      const queries = await queryModel.find().populate("userId")
      res.json({
        message:"Query Fetched Successfully",
        data:queries
      });
};


const addQuery = async(req,res) =>{

const savedQuery = await queryModel.create(req.body)
  
  res.json({
    message:"Query created..",
    data:savedQuery
  })
}

const deleteQuery = async(req,res)=>{

const deletedQuery = await queryModel.findByIdAndDelete(req.params.id)
    
  res.json({
    message:"Query deleted Successfully",
    data:deletedQuery
  })
}


const getQueryById = async(req,res)=>{

  const foundQuery = await queryModel.findById(req.params.id)
  res.json({
    message:"Query fetched...",
    data:foundQuery
  })

}

module.exports ={
    getAllQueries,addQuery,deleteQuery,getQueryById
}