const Fee = require('../models/Fee')
const Payment = require('../models/Payment')


const validateFeeSetup = require('../validations/fee-setup')


exports.setCharges = async (req, res) => {
    try {
        const { errors, isValid } = validateFeeSetup(req.body)
        const { paymentAddress, paymentType, paymentAmount } = req.body

        if (!isValid) return res.status(400).json(errors)

        const isFee = await Fee.findOne({ 'paymentType': paymentType })

        if (isFee) {
            errors.paymentType = 'payment setup of this type has been set'
            return res.status(400).json(errors)
        }

        const fee = await Fee.create({ paymentAddress, paymentType, paymentAmount })
        if (fee) return res.json(fee)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.getUnverifiedDepartmentReceipts = async (req, res) => {
    try {
        const { departmentId } = req.params
        const receipts = await Payment.find({ 'paymentDepartment': departmentId, 'paymentType': 'Department Fees' })
            .select('-createdAt -updatedAt -__v')

        if (receipts) {
            const unverfied = receipts.filter(r => r.verified === false)
            return res.json(unverfied)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}


exports.getVerifiedDepartmentReceipts = async (req, res) => {
    try {
        const { departmentId } = req.params
        const receipts = await Payment.find({ 'paymentDepartment': departmentId, 'paymentType': 'Department Fees' })
            .select('-createdAt -updatedAt -__v')

        if (receipts) {
            const verfied = receipts.filter(r => r.verified === true)
            return res.json(verfied)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}



exports.getVerifiedSchoolReceipts = async (req, res) => {
    try {
        const { facultyId, department } = req.params
        const receipts = await Payment.find({ 'paymentDepartment': department, 'paymentType': 'School Fees' })
            .select('-createdAt -updatedAt -__v')

        if (receipts) {
            const verfied = receipts.filter(r => r.verified === true)
            return res.json(verfied)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'server error occured' })
    }
}