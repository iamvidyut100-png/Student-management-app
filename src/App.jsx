import React, { useMemo, useState } from "react";
import {
  LayoutDashboard, Users, Layers3, CalendarCheck2, WalletCards, Plus,
  Search, MoreHorizontal, Phone, IndianRupee, Check, X, Menu, ChevronRight,
  GraduationCap, Bell, TrendingUp, UserRoundPlus, CircleDollarSign, ClipboardCheck,
  Trash2
} from "lucide-react";

const seed = {
  batches: [
    { id: "b1", name: "Class 12 Physics", subject: "Physics", time: "6:00 PM", days: "Mon · Wed · Fri" },
    { id: "b2", name: "Class 10 Maths", subject: "Mathematics", time: "7:00 PM", days: "Tue · Thu · Sat" },
    { id: "b3", name: "SSC GD", subject: "Competitive", time: "5:00 PM", days: "Mon · Wed · Fri" }
  ],
  students: [
    { id: "s1", name: "Rahul Das", phone: "9876543210", parent: "Ramesh Das", batchId: "b1", fee: 1000, status: "Active", joined: "2026-04-12" },
    { id: "s2", name: "Priya Sharma", phone: "9123456780", parent: "Sunil Sharma", batchId: "b2", fee: 750, status: "Active", joined: "2026-05-03" },
    { id: "s3", name: "Aman Ali", phone: "9864123456", parent: "Karim Ali", batchId: "b3", fee: 1000, status: "Active", joined: "2026-06-18" },
    { id: "s4", name: "Neha Nath", phone: "9435123456", parent: "Bimal Nath", batchId: "b1", fee: 1000, status: "Active", joined: "2026-07-09" }
  ],
  payments: [
    { id: "p1", studentId: "s1", amount: 1000, date: "2026-09-05" },
    { id: "p2", studentId: "s2", amount: 750, date: "2026-09-04" },
    { id: "p3", studentId: "s3", amount: 1000, date: "2026-09-02" }
  ],
  attendance: {}
};

function loadData() {
  try {
    const saved = localStorage.getItem("student-management-data");
    const data = saved ? JSON.parse(saved) : seed;
    const now = new Date().toISOString().slice(0, 10);
    const batchesToAdd = [
      { id: "b-gcc-physics", name: "Physics — GCC Batch", subject: "Physics", time: "5:30 PM", days: "Tue · Thu · Sat" },
      { id: "b-maths-2nd-year", name: "Maths — 2nd Year", subject: "Mathematics", time: "6:00 PM", days: "Mon · Wed · Fri" }
    ];
    const studentsToAdd = [
      { id: "b-gcc-physics-s1", name: "Krishna Das", note: "[23/4]1+", batchId: "b-gcc-physics" },
      { id: "b-gcc-physics-s2", name: "Abhijeet Das", note: "[23/4]", batchId: "b-gcc-physics" },
      { id: "b-gcc-physics-s3", name: "Sourav Chauhan", note: "", batchId: "b-gcc-physics" },
      { id: "b-gcc-physics-s4", name: "Debosmita Chetry", note: "1+", batchId: "b-gcc-physics" },
      { id: "b-gcc-physics-s5", name: "Narayan Chouhan", note: "[25/5]", batchId: "b-gcc-physics" },
      { id: "b-gcc-physics-s6", name: "Gita Sangma", note: "[27/5]", batchId: "b-gcc-physics" },
      { id: "b-gcc-physics-s7", name: "Nomita Kumari", note: "-", batchId: "b-gcc-physics" },
      { id: "b-gcc-physics-s8", name: "Survala Devi", note: "-", batchId: "b-gcc-physics" },
      { id: "b-gcc-physics-s9", name: "Aditya Chauhan", note: "", batchId: "b-gcc-physics" },
      { id: "b-maths-2nd-year-s1", name: "Abhijeet", note: "", batchId: "b-maths-2nd-year" },
      { id: "b-maths-2nd-year-s2", name: "Krishna", note: "1+", batchId: "b-maths-2nd-year" },
      { id: "b-maths-2nd-year-s3", name: "Sourav", note: "", batchId: "b-maths-2nd-year" },
      { id: "b-maths-2nd-year-s4", name: "Gajendra", note: "1+", batchId: "b-maths-2nd-year" },
      { id: "b-maths-2nd-year-s5", name: "Sangmai", note: "1+", batchId: "b-maths-2nd-year" },
      { id: "b-maths-2nd-year-s6", name: "Desh Bandhu 1", note: "1", batchId: "b-maths-2nd-year" },
      { id: "b-maths-2nd-year-s7", name: "Desh Bandhu 2", note: "", batchId: "b-maths-2nd-year" }
    ];
    const existingBatchIds = new Set((data.batches || []).map(b => b.id));
    const batches = [...(data.batches || []), ...batchesToAdd.filter(b => !existingBatchIds.has(b.id))];
    const existingStudentIds = new Set((data.students || []).map(s => s.id));
    const students = [
      ...(data.students || []),
      ...studentsToAdd.filter(s => !existingStudentIds.has(s.id)).map(s => ({
        ...s, phone: "", parent: "", fee: 1000, status: "Active", joined: now
      }))
    ];
    const migratedStudents = students.map(s => ({ ...s, batchIds: Array.isArray(s.batchIds) ? s.batchIds : (s.batchId ? [s.batchId] : []) }));
    const next = { ...seed, ...data, batches, students: migratedStudents, payments: data.payments || [], attendance: data.attendance || {} };
    localStorage.setItem("student-management-data", JSON.stringify(next));
    return next;
  } catch {
    return seed;
  }
}

const money = n => "₹" + Number(n || 0).toLocaleString("en-IN");
const today = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const save = next => {
    setData(next);
    localStorage.setItem("student-management-data", JSON.stringify(next));
  };

  const batchName = id => data.batches.find(b => b.id === id)?.name || "Unassigned";
  const batchNames = ids => (ids || []).map(batchName).join(" · ") || "Unassigned";
  const monthKey = new Date().toISOString().slice(0, 7);
  const paidThisMonth = useMemo(() =>
    data.payments.filter(p => p.date.startsWith(monthKey)).reduce((s, p) => s + Number(p.amount), 0), [data.payments, monthKey]);

  const pending = useMemo(() => data.students.reduce((s, st) => {
    const paid = data.payments.filter(p => p.studentId === st.id && p.date.startsWith(monthKey)).reduce((a,p) => a + Number(p.amount), 0);
    return s + Math.max(0, Number(st.fee) - paid);
  }, 0), [data]);

  const attendanceToday = Object.values(data.attendance[today()] || {});
  const presentToday = attendanceToday.filter(Boolean).length;
  const attendanceRate = attendanceToday.length ? Math.round((presentToday / attendanceToday.length) * 100) : 0;

  const addStudent = form => {
    const student = { ...form, id: "s" + Date.now(), batchIds: form.batchIds || [], fee: Number(form.fee), status: "Active", joined: today() };
    save({ ...data, students: [student, ...data.students] });
    setModal(null);
  };

  const editStudent = (id, form) => { save({ ...data, students: data.students.map(s => s.id === id ? { ...s, ...form, batchIds: form.batchIds || [], fee: Number(form.fee) } : s) }); setModal(null); };

  const deleteStudent = id => {
    const student = data.students.find(s => s.id === id);
    if (!student) return;
    if (!window.confirm("Delete " + student.name + "? This will also remove their payment and attendance records.")) return;

    const attendance = Object.fromEntries(
      Object.entries(data.attendance || {}).map(([date, marks]) => {
        const nextMarks = { ...marks };
        delete nextMarks[id];
        return [date, nextMarks];
      })
    );
    save({
      ...data,
      students: data.students.filter(s => s.id !== id),
      payments: data.payments.filter(p => p.studentId !== id),
      attendance
    });
  };

  const addBatch = form => {
    const batch = { ...form, id: "b" + Date.now() };
    save({ ...data, batches: [batch, ...data.batches] });
    setModal(null);
  };

  const recordPayment = form => {
    const payment = { ...form, id: "p" + Date.now(), amount: Number(form.amount), date: today() };
    save({ ...data, payments: [payment, ...data.payments] });
    setModal(null);
  };

  const markAttendance = (date, studentId, present) => {
    const day = { ...(data.attendance[date] || {}), [studentId]: present };
    save({ ...data, attendance: { ...data.attendance, [date]: day } });
  };

  const nav = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["students", "Students", Users],
    ["batches", "Batches", Layers3],
    ["attendance", "Attendance", CalendarCheck2],
    ["fees", "Fees", WalletCards]
  ];

  const title = nav.find(n => n[0] === page)?.[1] || "Dashboard";

  return <div className="app">
    <aside className={"sidebar " + (mobileOpen ? "open" : "")}>
      <div className="brand"><div className="brand-mark"><GraduationCap size={21}/></div><div><strong>Student<span>Hub</span></strong><small>Management</small></div></div>
      <nav>{nav.map(([key,label,Icon]) =>
        <button key={key} className={page === key ? "active" : ""} onClick={() => {setPage(key);setMobileOpen(false)}}><Icon size={19}/><span>{label}</span></button>
      )}</nav>
      <div className="sidebar-bottom"><div className="mini-card"><Bell size={17}/><div><b>Stay organized</b><span>Manage your centre easily.</span></div></div></div>
    </aside>
    {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)}/>}
    <main className="main">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu/></button><div><div className="eyebrow">TUITION CENTRE</div><h1>{title}</h1></div><div className="top-actions"><div className="search-top"><Search size={17}/><input placeholder="Search students..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="avatar">V</div></div></header>
      {page === "dashboard" && <Dashboard data={data} batchName={batchName} paid={paidThisMonth} pending={pending} rate={attendanceRate} onPage={setPage} onModal={setModal}/>}
      {page === "students" && <Students data={data} batchName={batchName} search={search} batchNames={batchNames} onModal={setModal} onEdit={id=>setModal({type:"editStudent",id})} onDelete={deleteStudent}/>}
      {page === "batches" && <Batches data={data} onModal={setModal}/>}
      {page === "attendance" && <Attendance data={data} batchName={batchName} onMark={markAttendance}/>}
      {page === "fees" && <Fees data={data} batchName={batchName} onModal={setModal}/>}
    </main>
    {modal === "student" && <StudentModal batches={data.batches} onClose={()=>setModal(null)} onSave={addStudent}/>}
    {modal?.type === "editStudent" && <StudentModal student={data.students.find(s=>s.id===modal.id)} batches={data.batches} onClose={()=>setModal(null)} onSave={f=>editStudent(modal.id,f)}/>}
    {modal === "batch" && <BatchModal onClose={()=>setModal(null)} onSave={addBatch}/>}
    {modal === "payment" && <PaymentModal students={data.students} onClose={()=>setModal(null)} onSave={recordPayment}/>}
  </div>;
}

function Dashboard({data,batchName,paid,pending,rate,onPage,onModal}) {
  const cards=[
    ["Total Students",data.students.length,Users,"blue"],
    ["Active Batches",data.batches.length,Layers3,"purple"],
    ["Collected This Month",money(paid),CircleDollarSign,"green"],
    ["Pending Fees",money(pending),WalletCards,"orange"]
  ];
  return <div className="content">
    <section className="welcome"><div><p>Good to see you 👋</p><h2>Here’s what’s happening today.</h2><span>Keep your student records, attendance and fees in one place.</span></div><button className="primary" onClick={()=>onModal("student")}><Plus size={18}/> Add Student</button></section>
    <div className="stats">{cards.map(([label,value,Icon,color])=><div className="stat" key={label}><div className={"stat-icon "+color}><Icon size={19}/></div><div><span>{label}</span><strong>{value}</strong></div></div>)}</div>
    <div className="grid-2">
      <section className="panel"><div className="panel-head"><div><h3>Today’s attendance</h3><span>Across all active students</span></div><button className="link" onClick={()=>onPage("attendance")}>Mark attendance <ChevronRight size={15}/></button></div><div className="attendance-big"><div className="ring" style={{"--rate":rate}}><strong>{rate}%</strong><span>Present</span></div><div className="att-copy"><b>{Object.values(data.attendance[today()]||{}).filter(Boolean).length} present</b><span>of {Object.keys(data.attendance[today()]||{}).length || data.students.length} marked today</span><button className="soft" onClick={()=>onPage("attendance")}><ClipboardCheck size={16}/> Open attendance</button></div></div></section>
      <section className="panel"><div className="panel-head"><div><h3>Quick actions</h3><span>Common tasks</span></div></div><div className="quick-grid"><button onClick={()=>onModal("student")}><UserRoundPlus/><b>Add student</b><span>Create a profile</span></button><button onClick={()=>onModal("payment")}><IndianRupee/><b>Record fee</b><span>Add a payment</span></button><button onClick={()=>onPage("attendance")}><CalendarCheck2/><b>Attendance</b><span>Mark today</span></button><button onClick={()=>onModal("batch")}><Layers3/><b>New batch</b><span>Create a batch</span></button></div></section>
    </div>
    <section className="panel"><div className="panel-head"><div><h3>Recent students</h3><span>Latest admissions</span></div><button className="link" onClick={()=>onPage("students")}>View all <ChevronRight size={15}/></button></div><StudentTable students={data.students.slice(0,5)} batchName={batchName} batchNames={batchNames}/></section>
  </div>
}

function Students({data,batchName,batchNames,search,onModal,onEdit,onDelete}) {
  const filtered=data.students.filter(s=>(s.name+" "+s.phone+" "+batchNames(s.batchIds || (s.batchId ? [s.batchId] : []))).toLowerCase().includes(search.toLowerCase()));
  return <div className="content"><div className="page-actions"><div><p className="muted">Manage your student records</p><h2>All Students <span className="count">{data.students.length}</span></h2></div><button className="primary" onClick={()=>onModal("student")}><Plus size={18}/> Add Student</button></div><section className="panel table-panel"><div className="mobile-search"><Search size={16}/><input placeholder="Search by name, phone or batch" value={search} readOnly/></div><StudentTable students={filtered} batchName={batchName} onEdit={onEdit} onDelete={onDelete} empty="No students found."/></section></div>
}

function StudentTable({students,batchName,batchNames,onEdit,onDelete,empty="No students yet."}) {
  return <div className="table-wrap"><table><thead><tr><th>Student</th><th>Batch</th><th>Fee / month</th><th>Status</th><th>Action</th></tr></thead><tbody>{students.map(s=><tr key={s.id}><td><div className="person"><div className="person-avatar">{s.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div><b>{s.name}</b><span>{s.phone}</span></div></div></td><td>{batchNames ? batchNames(s.batchIds || (s.batchId ? [s.batchId] : [])) : batchName(s.batchId)}</td><td>{money(s.fee)}</td><td><span className="status"><i/> {s.status}</span></td><td><div className="row-actions"><button className="icon-btn edit" title="Edit student" onClick={()=>onEdit?.(s.id)}>✎</button><button className="icon-btn danger" title="Delete student" onClick={()=>onDelete?.(s.id)}><Trash2 size={17}/></button></div></td></tr>)}</tbody></table>{!students.length&&<div className="empty">{empty}</div>}</div>
}

function Batches({data,onModal}) {
  return <div className="content"><div className="page-actions"><div><p className="muted">Organize your classes</p><h2> Batches <span className="count">{data.batches.length}</span></h2></div><button className="primary" onClick={()=>onModal("batch")}><Plus size={18}/> New Batch</button></div><div className="batch-grid">{data.batches.map(b=>{const count=data.students.filter(s=>(s.batchIds || (s.batchId ? [s.batchId] : [])).includes(b.id)).length;return <div className="batch-card" key={b.id}><div className="batch-icon"><Layers3/></div><div className="batch-main"><h3>{b.name}</h3><span>{b.subject}</span></div><div className="batch-meta"><div><b>{count}</b><span>Students</span></div><div><b>{b.time}</b><span>Class time</span></div></div><div className="days">{b.days}</div></div>})}</div></div>
}

function Attendance({data,batchName,onMark}) {
  const [date,setDate]=useState(today()); const [batch,setBatch]=useState("all");
  const students=data.students.filter(s=>batch==="all"||(s.batchIds || (s.batchId ? [s.batchId] : [])).includes(batch));
  const marks=data.attendance[date]||{};
  const present=students.filter(s=>marks[s.id]===true).length;
  const absent=students.filter(s=>marks[s.id]===false).length;
  const unmarked=students.length-present-absent;
  return <div className="content"><div className="page-actions"><div><p className="muted">Mark attendance student-by-student</p><h2>Attendance</h2></div><div className="filters"><input type="date" value={date} onChange={e=>setDate(e.target.value)}/><select value={batch} onChange={e=>setBatch(e.target.value)}><option value="all">All batches</option>{data.batches.map(b=><option value={b.id} key={b.id}>{b.name}</option>)}</select></div></div><section className="panel attendance-panel"><div className="attendance-summary"><div><b>{present} Present</b><span> · {absent} Absent · {unmarked} Not marked</span></div><span className="summary-pill">{students.length?Math.round(present/students.length*100):0}%</span></div><div className="attendance-list">{students.map((s,index)=>{const status=marks[s.id];return <div className="attendance-row" key={s.id}><div className="person"><div className="person-avatar">{s.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div><b>{index+1}. {s.name}</b><span>{batchName(s.batchId)}{s.phone ? " · " + s.phone : ""}{s.note ? " · " + s.note : ""}</span></div></div><div className="attendance-buttons"><button className={status===true?"present":""} onClick={()=>onMark(date,s.id,true)}><Check size={17}/> Present</button><button className={status===false?"absent":""} onClick={()=>onMark(date,s.id,false)}><X size={17}/> Absent</button></div></div>})}</div></section></div>
}

function Fees({data,batchName,onModal}) {
  const monthKey=new Date().toISOString().slice(0,7);
  const rows=data.students.map(s=>{const paid=data.payments.filter(p=>p.studentId===s.id&&p.date.startsWith(monthKey)).reduce((a,p)=>a+Number(p.amount),0);return {...s,paid,due:Math.max(0,s.fee-paid)}})
  return <div className="content"><div className="page-actions"><div><p className="muted">Track monthly collections</p><h2>Fees</h2></div><button className="primary" onClick={()=>onModal("payment")}><Plus size={18}/> Record Payment</button></div><div className="fee-cards"><div><span>Collected</span><b>{money(rows.reduce((a,r)=>a+r.paid,0))}</b></div><div><span>Pending</span><b>{money(rows.reduce((a,r)=>a+r.due,0))}</b></div><div><span>Paid students</span><b>{rows.filter(r=>r.due===0).length}/{rows.length}</b></div></div><section className="panel table-panel"><div className="panel-head"><div><h3>September {new Date().getFullYear()}</h3><span>Monthly fee status</span></div></div><div className="table-wrap"><table><thead><tr><th>Student</th><th>Batch</th><th>Monthly fee</th><th>Paid</th><th>Due</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td><div className="person"><div className="person-avatar">{r.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div><b>{r.name}</b><span>{r.phone}</span></div></div></td><td>{batchName(r.batchId)}</td><td>{money(r.fee)}</td><td className="paid">{money(r.paid)}</td><td className={r.due?"due":"paid"}>{money(r.due)}</td></tr>)}</tbody></table></div></section></div>
}

function Modal({title,children,onClose,onSubmit,submit="Save"}) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><h3>{title}</h3><button onClick={onClose}>×</button></div>{children}<button className="primary full" onClick={onSubmit}>{submit}</button></div></div>
}
function StudentModal({batches,onClose,onSave,student}) {
  const [f,setF]=useState(student ? {name:student.name||"",phone:student.phone||"",parent:student.parent||"",batchId:student.batchId||batches[0]?.id||"",fee:student.fee||1000,status:student.status||"Active"} : {name:"",phone:"",parent:"",batchId:batches[0]?.id||"",fee:1000,status:"Active"});
  const set=(k,v)=>setF({...f,[k]:v});
  return <Modal title={student ? "Edit student" : "Add student"} onClose={onClose} onSubmit={()=>f.name&&onSave(f)}><div className="form-grid"><label>Student name<input value={f.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Rahul Das"/></label><label>Student phone<input value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="10-digit number"/></label><label>Parent / guardian<input value={f.parent} onChange={e=>set("parent",e.target.value)} placeholder="Parent name"/></label><label>Monthly fee<input type="number" value={f.fee} onChange={e=>set("fee",e.target.value)}/></label><label>Status<select value={f.status} onChange={e=>set("status",e.target.value)}><option>Active</option><option>Inactive</option></select></label><label className="wide">Batches<div className="batch-checks">{batches.map(b=><label className="check-option" key={b.id}><input type="checkbox" checked={f.batchIds.includes(b.id)} onChange={e=>set("batchIds",e.target.checked ? [...f.batchIds,b.id] : f.batchIds.filter(id=>id!==b.id))}/><span>{b.name}</span></label>)}</div></label></div></Modal>
}
function BatchModal({onClose,onSave}) {
  const [f,setF]=useState({name:"",subject:"",time:"6:00 PM",days:"Mon · Wed · Fri"}); const set=(k,v)=>setF({...f,[k]:v});
  return <Modal title="Create batch" onClose={onClose} onSubmit={()=>f.name&&onSave(f)}><div className="form-grid"><label>Batch name<input value={f.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Class 12 Physics"/></label><label>Subject<input value={f.subject} onChange={e=>set("subject",e.target.value)} placeholder="Physics"/></label><label>Class time<input value={f.time} onChange={e=>set("time",e.target.value)} placeholder="6:00 PM"/></label><label>Days<input value={f.days} onChange={e=>set("days",e.target.value)} placeholder="Mon · Wed · Fri"/></label></div></Modal>
}
function PaymentModal({students,onClose,onSave}) {
  const [f,setF]=useState({studentId:students[0]?.id||"",amount:1000}); const set=(k,v)=>setF({...f,[k]:v});
  return <Modal title="Record payment" onClose={onClose} onSubmit={()=>onSave(f)}><div className="form-grid"><label className="wide">Student<select value={f.studentId} onChange={e=>set("studentId",e.target.value)}>{students.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select></label><label>Amount<input type="number" value={f.amount} onChange={e=>set("amount",e.target.value)}/></label></div></Modal>
}
