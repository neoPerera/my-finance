import Footer from '../Elements/Footer';
import NavBar from '../Elements/NavBar';
import SideBar from '../Elements/SideBar';
import NotFound from './404';
import LogIn from './Login';
import DashBoard from './SubPages/DashBoard';
import { BrowserRouter as Router, Route, Routes,Outlet } from 'react-router-dom';
import RefMasExpenseForm from './SubPages/Reference/RefMasExpenseForm';
import RefMasExpenseList from './SubPages/Reference/RefMasExpenseList';
import ProtectedRoute from '../Mechanisms/ProtectedRoute';
import RefMasIncomeList from './SubPages/Reference/RefMasIncomeList';
import RefMasIncomeForm from './SubPages/Reference/RefMasIncomeForm';
import TransactionForm from './SubPages/Transaction/TransactionsForm';
function Home() {
  return (
    <div className="sidebar-mini">
      <div className="wrapper">
        <NavBar/>
        <SideBar />
  {/* <!-- Content Wrapper. Contains page content --> */}
  <div className="content-wrapper">
    {/* <!-- Main content --> */}
    {/* <DashBoard /> */}
     <Routes>
          
            <Route exact path='/' element={<DashBoard/>}/>
            <Route exact path='ref-expense' element={<RefMasExpenseList/>}/>
            <Route exact path='ref-expense/add' element={<RefMasExpenseForm/>}/>
            <Route exact path='ref-income' element={<RefMasIncomeList/>}/>
            <Route exact path='ref-income/add' element={<RefMasIncomeForm/>}/>
            {/* Transaction routes */}
            <Route exact path='transaction-add' element={<TransactionForm/>}/>
            <Route path='*' element={<NotFound/>}/>
          
        </Routes>

    {/* <!-- /.content --> */}
  </div>
  {/* <!-- /.content-wrapper --> */}

    <Footer />

  {/* <!-- Control Sidebar --> */}
  <aside className="control-sidebar control-sidebar-dark">
    {/* <!-- Control sidebar content goes here --> */}
  </aside>
  {/* <!-- /.control-sidebar --> */}
</div>
{/* <!-- ./wrapper --> */}

    </div>
  );
}

export default Home;
