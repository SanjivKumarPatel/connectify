import mongoose from 'mongoose'

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('database connected successfully✅')
    } catch (error) {
        console.error('database connection failed❌', error)
    }
}

export default connectDB