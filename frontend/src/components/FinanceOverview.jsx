import React from 'react'
import CustomPieChart from '../context/CustomPieChart'

const COLORES =["#875CF5", "#FA2C37", "#FF6900"]

function FinanceOverview(totalBalance, totalIncome, totalExpense) {

    const balancecharts =[
        {name :"totalBalance", amount : totalBalance},
        {name :"totalExpense", amount : totalExpense},
        {name :"totalIncome", amount : totalIncome},
    ]
  return (
    <div>
        <div className='card'>
            <div className="flex items-center justify-between"> 
                <h4 className='text-lg'>Financal overview</h4>
            </div>
        </div>
        <CustomPieChart data={balancecharts}  label="total balance" totalAmount={`$${totalBalance}`} colors={COLORES} showTextAncher />
    </div>
  )
}

export default FinanceOverview