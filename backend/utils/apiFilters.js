

class APIFilters{

    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){

        const keyword = this.queryStr.keyword ? 
        {
            name : {
                $regex : this.queryStr.keyword,
                $options : "i"
            }
        }:
        {};

        this.query = this.query.find({...keyword});
        return this;

    }

    filters(){
        let queryCopy = {...this.queryStr};
    
        let fieldsToRemove = ['keyword','page'];
        fieldsToRemove.forEach((el) => delete queryCopy[el]);
    
        // advanced filters for price , rating etc
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    
    pagination(resPerPage){

        let currentPage = Number(this.queryStr.page) || 1;
        let skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);

        return this;

    }

}


export default APIFilters;