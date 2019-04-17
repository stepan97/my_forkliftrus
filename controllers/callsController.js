const { CallOrder, validateCallOrder } = require('../models/CallOrder');

const callsKayfo = [
    {_id: 1, name: 'Name 1', phoneNumber: '111'},
    {_id: 2, name: 'Name 2', phoneNumber: '222'},
    {_id: 3, name: 'Name 3', phoneNumber: '333'}
];

module.exports = {
    async getAll() {
        // TODO: EDIT
        // const calls = await CallOrder.find();
        const calls =  callsKayfo;
        return calls;
    },

    async getById(id) {
        // TODO: Edit
        // const call = await CallOrder.findById(id);
        const call = callsKayfo.find(c => c._id === id);
        if (!call) return null;

        return call;
    },

    async post(values) {    
        const { error } = validateCallOrder(values);
        if (error) return { data: null, error: error.details[0].message };
    
        const callOrder = new CallOrder({
            name: values.name,
            phoneNumber: values.phoneNumber,
        });
    
        // TODO: uncomment below code, delete callsKayfo code
        // await callOrder.save();
        callsKayfo.push({_id: callsKayfo[callsKayfo.length - 1]._id + 1, name: values.name, phoneNumber: values.phoneNumber});
    
        // TODO: same uncomment&delete codes here
        // return { data: callOrder, err: null };
        return { data: callsKayfo[callsKayfo.length - 1], err: null };
    },

    async delete(id) {
        // const callOrder = await CallOrder.findByIdAndRemove(id);
        // return callOrder;

        // TODO: delete above code
        /** ONLY FOR TEST WITH MOCK ARRAY DATA **/
        const index = callsKayfo.findIndex(c => c._id === Number(id));
        const call = {
            _id: callsKayfo[index]._id,
            name: callsKayfo[index].name,
            phoneNumber: callsKayfo[index].phoneNumber
        };

        callsKayfo.splice(index, 1);
        console.log(call);
        
        
        return call ? call : null;
    }
};