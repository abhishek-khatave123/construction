import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, Building2, MapPin, ClipboardList, Users, Package,
  IndianRupee, FileBarChart, Bell, Settings, Search, Plus, Menu,
  CheckCircle2, AlertTriangle, Clock3, TrendingUp, HardHat,
  ArrowUpRight, CircleDollarSign, Boxes, CalendarDays, X, Camera
} from 'lucide-react';

const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const navItems = [
  ['Dashboard', LayoutDashboard], ['Projects', Building2], ['Sites', MapPin],
  ['Tasks', ClipboardList], ['Attendance', Users], ['Materials', Package],
  ['Expenses', IndianRupee], ['Reports', FileBarChart], ['Alerts', Bell],
  ['Settings', Settings]
];

const seedProjects = [
  { id: 1, name: 'Green Valley Apartments', client: 'Green Valley Homes', site: 'Site A · Mangaluru', budget: 1250000, spent: 845000, progress: 68, status: 'In progress' },
  { id: 2, name: 'Coastal Villa Renovation', client: 'R. Shetty', site: 'Site B · Mangaluru', budget: 650000, spent: 382000, progress: 54, status: 'In progress' },
  { id: 3, name: 'Lakeview Commercial Block', client: 'Lakeview Properties', site: 'Site C · Udupi', budget: 2100000, spent: 420000, progress: 22, status: 'Planning' }
];
const seedTasks = [
  { id: 1, title: 'Pouring slab — Site A', site: 'Green Valley Apartments', due: 'Today', status: 'In progress' },
  { id: 2, title: 'Electrical rough-in — Site B', site: 'Coastal Villa Renovation', due: 'Tomorrow', status: 'Pending' },
  { id: 3, title: 'Tile fixing — Site A', site: 'Green Valley Apartments', due: '16 Oct', status: 'Pending' },
  { id: 4, title: 'Foundation inspection — Site C', site: 'Lakeview Commercial Block', due: '17 Oct', status: 'Completed' }
];
const seedMaterials = [
  { id: 1, name: 'Cement bags', site: 'Site A', stock: 18, reorder: 25, unit: 'bags' },
  { id: 2, name: 'TMT steel rods', site: 'Site B', stock: 120, reorder: 50, unit: 'rods' },
  { id: 3, name: 'Bricks', site: 'Site A', stock: 850, reorder: 500, unit: 'pcs' },
  { id: 4, name: 'Tile adhesive', site: 'Site B', stock: 8, reorder: 15, unit: 'bags' }
];
const seedExpenses = [
  { id: 1, site: 'Site A', category: 'Materials', description: 'Cement and sand', amount: 24500, date: '14 Oct 2026' },
  { id: 2, site: 'Site B', category: 'Labour', description: 'Weekly wages', amount: 18000, date: '13 Oct 2026' },
  { id: 3, site: 'Site A', category: 'Transport', description: 'Material delivery', amount: 4500, date: '12 Oct 2026' }
];
const seedReports = [
  { id: 1, site: 'Site A', date: '14 Oct 2026', work: 'Reinforcement work completed on the first-floor slab.', issue: 'Cement stock is below reorder level.' },
  { id: 2, site: 'Site B', date: '13 Oct 2026', work: 'Electrical conduits installed in two rooms.', issue: 'Tile adhesive delivery pending.' }
];

export default function App() {
  const [section, setSection] = useState('Dashboard');
  const [projects, setProjects] = useState(seedProjects);
  const [tasks, setTasks] = useState(seedTasks);
  const [materials, setMaterials] = useState(seedMaterials);
  const [expenses, setExpenses] = useState(seedExpenses);
  const [reports, setReports] = useState(seedReports);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', site: '', budget: '', title: '', category: 'Materials', amount: '', description: '', stock: '', reorder: '' });

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const avgProgress = Math.round(projects.reduce((s, p) => s + p.progress, 0) / Math.max(projects.length, 1));
  const lowStock = materials.filter(m => m.stock < m.reorder);
  const filteredProjects = projects.filter(p => `${p.name} ${p.site} ${p.client}`.toLowerCase().includes(search.toLowerCase()));

  const flash = message => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const openModal = type => {
    setForm({ name: '', site: '', budget: '', title: '', category: 'Materials', amount: '', description: '', stock: '', reorder: '' });
    setModal(type);
  };
  const submit = e => {
    e.preventDefault();
    if (modal === 'project') {
      if (!form.name.trim()) return;
      setProjects(old => [...old, { id: Date.now(), name: form.name, client: 'New client', site: form.site || 'New site', budget: Number(form.budget) || 0, spent: 0, progress: 0, status: 'Planning' }]);
      flash('Project created');
    } else if (modal === 'task') {
      if (!form.title.trim()) return;
      setTasks(old => [...old, { id: Date.now(), title: form.title, site: form.site || 'Unassigned site', due: 'Not set', status: 'Pending' }]);
      flash('Task added');
    } else if (modal === 'expense') {
      if (!form.description.trim() || Number(form.amount) <= 0) return;
      const item = { id: Date.now(), site: form.site || 'Site A', category: form.category, description: form.description, amount: Number(form.amount), date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) };
      setExpenses(old => [item, ...old]);
      setProjects(old => old.map(p => p.site.startsWith(item.site) ? { ...p, spent: p.spent + item.amount } : p));
      flash('Expense recorded');
    } else if (modal === 'material') {
      if (!form.name.trim()) return;
      setMaterials(old => [...old, { id: Date.now(), name: form.name, site: form.site || 'Site A', stock: Number(form.stock) || 0, reorder: Number(form.reorder) || 0, unit: 'units' }]);
      flash('Material added');
    } else if (modal === 'attendance') {
      setAttendance(old => [{ id: Date.now(), worker: form.name || 'Worker', site: form.site || 'Site A', date: new Date().toLocaleDateString('en-IN'), status: 'Present' }, ...old]);
      flash('Attendance marked');
    } else if (modal === 'report') {
      setReports(old => [{ id: Date.now(), site: form.site || 'Site A', date: new Date().toLocaleDateString('en-IN'), work: form.description || form.title || 'Daily progress updated.', issue: form.title || 'No issue reported' }, ...old]);
      flash('Progress report added');
    }
    setModal('');
  };
  const toggleTask = id => {
    setTasks(old => old.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
    flash('Task status updated');
  };
  const goAdd = () => openModal(({Tasks:'task', Materials:'material', Expenses:'expense', Attendance:'attendance', Reports:'report'})[section] || 'project');

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><HardHat size={22}/></div><div><b>BuildPro</b><small>Site management</small></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{navItems.map(([label, Icon]) => <button key={label} className={`nav-item ${section === label ? 'active' : ''}`} onClick={() => { setSection(label); setMobileNav(false); }}><Icon size={18}/><span>{label}</span>{label === 'Alerts' && lowStock.length > 0 && <i className="nav-count">{lowStock.length}</i>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><HardHat size={18}/></div><b>Need a hand?</b><p>Keep every site moving smoothly.</p><button onClick={() => setSection('Reports')}>View reports <ArrowUpRight size={14}/></button></div><div className="profile"><div className="avatar">PC</div><div><b>Project Contractor</b><small>Administrator · Demo</small></div><Settings size={16}/></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{section}</b></div><div className="top-actions"><div className="demo-pill"><span className="status-dot green"></span> Frontend demo</div><button className="icon-button notification-button" onClick={() => setSection('Alerts')} title="Notifications"><Bell size={18}/>{lowStock.length > 0 && <i/>}</button><div className="avatar">PC</div></div></header>
      <div className="page-content">
        <div className="page-heading"><div><div className="eyebrow">WEDNESDAY, 14 OCTOBER 2026</div><h1>{section === 'Dashboard' ? 'Good morning, Contractor' : section}</h1><p>{section === 'Dashboard' ? 'Here’s what’s happening across your construction sites.' : `Manage your ${section.toLowerCase()} in one place.`}</p></div><div className="heading-actions"><button className="btn btn-secondary" onClick={() => setSection('Reports')}><FileBarChart size={16}/> Reports</button><button className="btn btn-primary" onClick={goAdd}><Plus size={17}/>{section === 'Tasks' ? 'Add task' : section === 'Materials' ? 'Add material' : section === 'Expenses' ? 'Add expense' : section === 'Attendance' ? 'Mark attendance' : section === 'Reports' ? 'Add report' : 'New project'}</button></div></div>

        {section === 'Dashboard' && <>
          <div className="metric-grid">
            <Metric icon={Building2} label="Active projects" value={projects.length} note={`${projects.filter(p => p.status === 'In progress').length} currently in progress`} tone="blue"/>
            <Metric icon={MapPin} label="Total sites" value={new Set(projects.map(p => p.site)).size} note="Across all projects" tone="green"/>
            <Metric icon={CircleDollarSign} label="Total expenses" value={money(totalSpent)} note={`Budget: ${money(totalBudget)}`} tone="orange"/>
            <Metric icon={TrendingUp} label="Average progress" value={`${avgProgress}%`} note={`${Math.round(totalSpent / Math.max(totalBudget, 1) * 100)}% of budget used`} tone="purple"/>
          </div>
          <div className="content-grid">
            <section className="panel"><PanelTitle title="Project progress" subtitle="Status across your active projects" action="View projects" onAction={() => setSection('Projects')}/><div className="project-list">{projects.slice(0,4).map(p=><div className="project-row" key={p.id}><div className="project-symbol"><Building2 size={18}/></div><div className="project-info"><b>{p.name}</b><small>{p.site} · {p.status}</small><div className="progress-track"><span style={{width:`${p.progress}%`}}/></div></div><div className="project-numbers"><b>{p.progress}%</b><small>{money(p.spent)} spent</small></div></div>)}</div></section>
            <section className="panel"><PanelTitle title="Budget overview" subtitle="Recorded expenses vs planned budget"/><div className="budget-wrap"><div className="donut" style={{'--progress':`${Math.min(totalSpent/Math.max(totalBudget,1),1)*100}%`}}><div><b>{Math.round(totalSpent/Math.max(totalBudget,1)*100)}%</b><small>used</small></div></div><div className="budget-legend"><span><i className="legend-blue"/>Spent <b>{money(totalSpent)}</b></span><span><i className="legend-gray"/>Remaining <b>{money(Math.max(totalBudget-totalSpent,0))}</b></span></div></div><div className="budget-foot"><span>Overall planned budget</span><b>{money(totalBudget)}</b></div></section>
          </div>
          <div className="content-grid lower-grid">
            <section className="panel"><PanelTitle title="Upcoming tasks" subtitle="Small steps keep projects on track" action="All tasks" onAction={() => setSection('Tasks')}/><TaskList tasks={tasks.slice(0,4)} toggleTask={toggleTask}/></section>
            <section className="panel"><PanelTitle title="Needs attention" subtitle="Items that may slow site work" action="View alerts" onAction={() => setSection('Alerts')}/>{lowStock.length === 0 ? <div className="empty-state compact"><CheckCircle2 size={28}/><b>You're all caught up</b><span>No new alerts right now.</span></div> : <div className="alert-list">{lowStock.map(m=><AlertRow key={m.id} title={`Low stock: ${m.name}`} detail={`${m.site} · ${m.stock} ${m.unit} left`}/>)}</div>}</section>
          </div>
        </>}

        {section === 'Projects' && <section className="panel"><PanelTitle title="All projects" subtitle={`${projects.length} projects in your workspace`}/><div className="table-tools"><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects or sites…"/></div><button className="btn btn-primary" onClick={()=>openModal('project')}><Plus size={16}/> New project</button></div><div className="table-wrap"><table><thead><tr><th>Project</th><th>Site</th><th>Progress</th><th>Budget</th><th>Spent</th><th>Status</th></tr></thead><tbody>{filteredProjects.map(p=><tr key={p.id}><td><b>{p.name}</b><small>{p.client}</small></td><td>{p.site}</td><td><div className="table-progress"><span>{p.progress}%</span><div className="progress-track"><span style={{width:`${p.progress}%`}}/></div></div></td><td>{money(p.budget)}</td><td>{money(p.spent)}</td><td><span className={`tag ${p.status==='Planning'?'tag-neutral':'tag-success'}`}>{p.status}</span></td></tr>)}</tbody></table></div></section>}

        {section === 'Sites' && <section className="panel"><PanelTitle title="Construction sites" subtitle="Sites associated with your projects"/><div className="site-grid">{projects.map(p=><div className="site-card" key={p.id}><div className="site-card-top"><div className="site-icon"><MapPin size={20}/></div><span className={`tag ${p.status==='Planning'?'tag-neutral':'tag-success'}`}>{p.status}</span></div><h3>{p.site}</h3><p>{p.name}</p><div className="site-meta"><span><TrendingUp size={15}/> {p.progress}% complete</span><span><IndianRupee size={15}/> {money(p.budget)}</span></div><div className="progress-track"><span style={{width:`${p.progress}%`}}/></div></div>)}</div></section>}

        {section === 'Tasks' && <section className="panel"><PanelTitle title="Task board" subtitle="Assign and track site work"/><TaskList tasks={tasks} toggleTask={toggleTask} showSite/><div className="inline-add"><button className="btn btn-primary" onClick={()=>openModal('task')}><Plus size={16}/> Add task</button></div></section>}

        {section === 'Attendance' && <section className="panel"><PanelTitle title="Worker attendance" subtitle="Daily attendance log"/><div className="section-intro"><MiniMetric icon={Users} value={attendance.length} label="Records added in this session"/><button className="btn btn-primary" onClick={()=>openModal('attendance')}><Plus size={16}/> Mark attendance</button></div>{attendance.length===0?<Empty icon={Users} title="No attendance records yet" text="Mark attendance to start your daily log."/>:<div className="table-wrap"><table><thead><tr><th>Worker</th><th>Site</th><th>Date</th><th>Status</th></tr></thead><tbody>{attendance.map(a=><tr key={a.id}><td><b>{a.worker}</b></td><td>{a.site}</td><td>{a.date}</td><td><span className="tag tag-success">{a.status}</span></td></tr>)}</tbody></table></div>}</section>}

        {section === 'Materials' && <section className="panel"><PanelTitle title="Material inventory" subtitle="Monitor stock and reorder levels"/><div className="table-tools"><div className="stock-summary"><Boxes size={18}/><span>{materials.length} inventory items</span><span className="tag tag-warning">{lowStock.length} low stock</span></div><button className="btn btn-primary" onClick={()=>openModal('material')}><Plus size={16}/> Add material</button></div><div className="table-wrap"><table><thead><tr><th>Material</th><th>Site</th><th>Current stock</th><th>Reorder level</th><th>Status</th></tr></thead><tbody>{materials.map(m=><tr key={m.id}><td><b>{m.name}</b></td><td>{m.site}</td><td>{m.stock} {m.unit}</td><td>{m.reorder} {m.unit}</td><td><span className={`tag ${m.stock<m.reorder?'tag-warning':'tag-success'}`}>{m.stock<m.reorder?'Reorder':'In stock'}</span></td></tr>)}</tbody></table></div></section>}

        {section === 'Expenses' && <section className="panel"><PanelTitle title="Expense tracker" subtitle="Keep project costs visible"/><div className="section-intro"><MiniMetric icon={IndianRupee} value={money(expenses.reduce((s,e)=>s+e.amount,0))} label="Total listed expenses"/><button className="btn btn-primary" onClick={()=>openModal('expense')}><Plus size={16}/> Add expense</button></div><div className="table-wrap"><table><thead><tr><th>Date</th><th>Site</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead><tbody>{expenses.map(e=><tr key={e.id}><td>{e.date}</td><td>{e.site}</td><td><span className="tag tag-neutral">{e.category}</span></td><td>{e.description}</td><td><b>{money(e.amount)}</b></td></tr>)}</tbody></table></div></section>}

        {section === 'Reports' && <section className="panel"><PanelTitle title="Daily progress reports" subtitle="Work completed and site issues"/><div className="report-list">{reports.map(r=><article className="report-card" key={r.id}><div className="report-date"><CalendarDays size={17}/><span>{r.date}</span><span className="tag tag-neutral">{r.site}</span></div><h3>{r.work}</h3><p><AlertTriangle size={15}/>{r.issue}</p></article>)}</div><button className="btn btn-primary" onClick={()=>openModal('report')}><Plus size={16}/> Add progress report</button></section>}

        {section === 'Alerts' && <section className="panel"><PanelTitle title="Alerts and reminders" subtitle="Review issues that need attention"/>{lowStock.length===0?<Empty icon={CheckCircle2} title="No alerts right now" text="Low-stock alerts will appear here."/>:<div className="alert-list">{lowStock.map(m=><AlertRow key={m.id} title={`Low stock: ${m.name}`} detail={`${m.site} has ${m.stock} ${m.unit}; reorder level is ${m.reorder}.`}/>)}</div>}</section>}

        {section === 'Settings' && <section className="panel settings-panel"><PanelTitle title="Workspace settings" subtitle="Basic application information"/><div className="settings-row"><div><b>Workspace name</b><small>Shown in the sidebar</small></div><span>BuildPro Construction</span></div><div className="settings-row"><div><b>Application type</b><small>This version runs entirely in the browser</small></div><span className="tag tag-success">Frontend only</span></div><div className="settings-row"><div><b>Data persistence</b><small>Changes reset when the page is refreshed</small></div><span className="tag tag-warning">Demo mode</span></div><div className="settings-note"><AlertTriangle size={18}/><p>This frontend uses sample data and local React state. A backend and database are needed to save records permanently or share them between users.</p></div></section>}
      </div>
      <footer className="footer"><span>BuildPro · Smart Construction Site Management</span><span>Frontend-only prototype · <span className="status-dot green inline-dot"></span> Ready</span></footer>
    </main>

    {modal && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal('')}><form className="modal" onSubmit={submit}><div className="modal-head"><div><div className="eyebrow">BUILDPRO WORKSPACE</div><h2>{({project:'Create project',task:'Add task',expense:'Record expense',material:'Add material',attendance:'Mark attendance',report:'Add progress report'})[modal]}</h2></div><button type="button" className="icon-button" onClick={()=>setModal('')} aria-label="Close"><X size={17}/></button></div>
      {modal==='project'&&<><Field label="Project name" required><input autoFocus required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Riverside Apartments"/></Field><Field label="Site name / location"><input value={form.site} onChange={e=>setForm({...form,site:e.target.value})} placeholder="e.g. Site D · Mangaluru"/></Field><Field label="Planned budget (₹)"><input type="number" min="0" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} placeholder="500000"/></Field></>}
      {modal==='task'&&<><Field label="Task title" required><input autoFocus required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Install plumbing"/></Field><Field label="Site / project"><input value={form.site} onChange={e=>setForm({...form,site:e.target.value})} placeholder="e.g. Site A"/></Field></>}
      {modal==='expense'&&<><Field label="Description" required><input autoFocus required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="e.g. Cement delivery"/></Field><Field label="Amount (₹)" required><input type="number" min="1" required value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="2500"/></Field><Field label="Category"><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Materials</option><option>Labour</option><option>Transport</option><option>Equipment</option><option>Other</option></select></Field><Field label="Site"><input value={form.site} onChange={e=>setForm({...form,site:e.target.value})} placeholder="Site A"/></Field></>}
      {modal==='material'&&<><Field label="Material name" required><input autoFocus required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Cement bags"/></Field><Field label="Site"><input value={form.site} onChange={e=>setForm({...form,site:e.target.value})} placeholder="Site A"/></Field><div className="form-row"><Field label="Current stock"><input type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="20"/></Field><Field label="Reorder level"><input type="number" min="0" value={form.reorder} onChange={e=>setForm({...form,reorder:e.target.value})} placeholder="25"/></Field></div></>}
      {modal==='attendance'&&<><Field label="Worker name" required><input autoFocus required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Worker name"/></Field><Field label="Site"><input value={form.site} onChange={e=>setForm({...form,site:e.target.value})} placeholder="Site A"/></Field></>}
      {modal==='report'&&<><Field label="Site"><input value={form.site} onChange={e=>setForm({...form,site:e.target.value})} placeholder="Site A"/></Field><Field label="Work completed" required><textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe today's progress"/></Field><Field label="Issue / blocker"><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Material delivery delayed"/></Field></>}
      <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={()=>setModal('')}>Cancel</button><button type="submit" className="btn btn-primary"><CheckCircle2 size={16}/> Save record</button></div>
    </form></div>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}

function Metric({icon:Icon,label,value,note,tone}) { return <div className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={19}/></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></div>; }
function PanelTitle({title,subtitle,action,onAction}) { return <div className="panel-title"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div>{action&&<button className="text-button" onClick={onAction}>{action}<ArrowUpRight size={14}/></button>}</div>; }
function TaskList({tasks,toggleTask,showSite=false}) { return <div className="task-list">{tasks.map(t=><div className="task-row" key={t.id}><button className={`task-check ${t.status==='Completed'?'checked':''}`} onClick={()=>toggleTask(t.id)} aria-label={`Toggle ${t.title}`}>{t.status==='Completed'&&<CheckCircle2 size={16}/>}</button><div className="task-text"><b className={t.status==='Completed'?'completed-text':''}>{t.title}</b>{showSite&&<small>{t.site}</small>}</div><span className="task-due"><Clock3 size={13}/>{t.due}</span><span className={`tag ${t.status==='Completed'?'tag-success':t.status==='In progress'?'tag-blue':'tag-neutral'}`}>{t.status}</span></div>)}</div>; }
function AlertRow({title,detail}) { return <div className="alert-row"><div className="alert-icon"><AlertTriangle size={17}/></div><div><b>{title}</b><small>{detail}</small></div><span className="tag tag-warning">Action needed</span></div>; }
function Empty({icon:Icon,title,text}) { return <div className="empty-state"><Icon size={30}/><b>{title}</b><span>{text}</span></div>; }
function MiniMetric({icon:Icon,value,label}) { return <div className="metric-mini"><Icon size={18}/><div><b>{value}</b><small>{label}</small></div></div>; }
function Field({label,required,children}) { return <label className="field"><span>{label}{required&&<i> *</i>}</span>{children}</label>; }
