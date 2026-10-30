import { useMemo, useState } from 'react'

const USER = { name: 'Alumno', initials: 'AL' }
const STAFF_USER = { name: 'Dra. Fernanda Zamora', initials: 'FZ', role: 'Cirujana dentista' }

const SERVICES = [
  { id: 'bienestar', name: 'Bienestar estudiantil', description: 'Orientación social y apoyo para beneficios', icon: 'heart', tone: 'blue', next: 'Hoy' },
  { id: 'dental', name: 'Servicio dental', description: 'Evaluación, prevención y atención odontológica', icon: 'sparkles', tone: 'cyan', next: 'Mañana' },
  { id: 'psicologia', name: 'Psicología', description: 'Acompañamiento emocional y salud mental', icon: 'brain', tone: 'violet', next: 'Mar, 8 sep' },
  { id: 'kinesiologia', name: 'Kinesiología', description: 'Evaluación y recuperación física', icon: 'activity', tone: 'orange', next: 'Mié, 9 sep' },
  { id: 'medicina', name: 'Servicio médico', description: 'Atención primaria y orientación de salud', icon: 'medical', tone: 'green', next: 'Hoy' },
]

const PROFESSIONALS = {
  bienestar: [{ id: 1, name: 'Eliana Ponce', role: 'Asistente social', initials: 'EP', color: '#2563eb', next: 'Hoy, 16:00' }, { id: 2, name: 'Camila Fuentes', role: 'Trabajadora social', initials: 'CF', color: '#0891b2', next: 'Mañana, 09:30' }],
  dental: [{ id: 3, name: 'Dra. Fernanda Zamora', role: 'Cirujana dentista', initials: 'FZ', color: '#7c3aed', next: 'Mañana, 10:30' }, { id: 4, name: 'Dr. Matías Araya', role: 'Cirujano dentista', initials: 'MA', color: '#ea580c', next: 'Jue, 10 sep' }],
  psicologia: [{ id: 5, name: 'Dr. Roberto Soto', role: 'Psicólogo clínico', initials: 'RS', color: '#7c3aed', next: 'Mar, 8 sep' }, { id: 6, name: 'Paula Ríos', role: 'Psicóloga', initials: 'PR', color: '#2563eb', next: 'Mié, 9 sep' }],
  kinesiologia: [{ id: 7, name: 'Tomás Silva', role: 'Kinesiólogo', initials: 'TS', color: '#ea580c', next: 'Mié, 9 sep' }],
  medicina: [{ id: 8, name: 'Dra. Javiera León', role: 'Médica general', initials: 'JL', color: '#059669', next: 'Hoy, 15:30' }, { id: 9, name: 'Dr. Nicolás Vera', role: 'Médico general', initials: 'NV', color: '#0891b2', next: 'Mañana, 11:00' }],
}

const PROFILE_DETAILS = {
  1: { bio: 'Orienta a estudiantes en beneficios, apoyos socioeconómicos y redes de acompañamiento universitario.', areas: ['Beneficios estudiantiles', 'Orientación social', 'Redes de apoyo'], email: 'eliana.ponce@usm.cl' },
  2: { bio: 'Acompaña procesos de adaptación universitaria y orienta en el acceso a apoyos internos y externos.', areas: ['Adaptación universitaria', 'Apoyo social', 'Derivaciones'], email: 'camila.fuentes@usm.cl' },
  3: { bio: 'Realiza evaluación odontológica general, acciones preventivas y orientación para tratamientos dentales.', areas: ['Evaluación dental', 'Prevención', 'Salud bucal'], email: 'fernanda.zamora@usm.cl' },
  4: { bio: 'Atiende consultas odontológicas generales con foco en diagnóstico temprano y cuidado preventivo.', areas: ['Diagnóstico', 'Higiene dental', 'Prevención'], email: 'matias.araya@usm.cl' },
  5: { bio: 'Brinda acompañamiento psicológico breve ante dificultades emocionales, académicas y de adaptación.', areas: ['Ansiedad', 'Estrés académico', 'Adaptación'], email: 'roberto.soto@usm.cl' },
  6: { bio: 'Acompaña a estudiantes en bienestar emocional, autocuidado y desarrollo de estrategias personales.', areas: ['Bienestar emocional', 'Autocuidado', 'Hábitos'], email: 'paula.rios@usm.cl' },
  7: { bio: 'Evalúa molestias musculoesqueléticas y entrega orientación inicial para la recuperación física.', areas: ['Evaluación funcional', 'Prevención de lesiones', 'Movilidad'], email: 'tomas.silva@usm.cl' },
  8: { bio: 'Entrega atención médica general, evaluación inicial y orientación sobre los pasos de cuidado necesarios.', areas: ['Medicina general', 'Evaluación inicial', 'Orientación'], email: 'javiera.leon@usm.cl' },
  9: { bio: 'Atiende consultas generales y orienta oportunamente a otros servicios de salud cuando corresponde.', areas: ['Atención primaria', 'Prevención', 'Derivación'], email: 'nicolas.vera@usm.cl' },
}

const DAYS = [
  { iso: '2026-09-08', weekday: 'Mar', day: '08', month: 'SEP', label: 'martes 8 de septiembre' },
  { iso: '2026-09-09', weekday: 'Mié', day: '09', month: 'SEP', label: 'miércoles 9 de septiembre' },
  { iso: '2026-09-10', weekday: 'Jue', day: '10', month: 'SEP', label: 'jueves 10 de septiembre' },
  { iso: '2026-09-11', weekday: 'Vie', day: '11', month: 'SEP', label: 'viernes 11 de septiembre' },
]

const TIMES = ['09:00', '09:45', '10:30', '11:15', '12:00', '14:30', '15:15', '16:00']

// Mock Data para Funcionario
const PATIENTS_TODAY = [
  { id: 'p1', time: '09:00', name: 'Axel González', rut: '20.123.456-7', status: 'pending', career: 'Ingeniería Civil en Informática', benefits: 'Gratuidad', health: 'Fonasa B', conditions: 'Hipertensión leve', meds: 'Losartán 50mg' },
  { id: 'p2', time: '09:45', name: 'Samira Estay', rut: '21.345.678-9', status: 'attended', career: 'Arquitectura', benefits: 'Beca Bicentenario', health: 'Isapre', conditions: 'Ninguna', meds: 'Ninguno' },
  { id: 'p3', time: '11:15', name: 'Vicente Pacheco', rut: '20.987.654-3', status: 'pending', career: 'Ingeniería Civil Electrónica', benefits: 'CAE', health: 'Fonasa C', conditions: 'Asma', meds: 'Salbutamol PRN' }
]

const PATIENT_HISTORY = [
  { id: 1, date: '15 AGO 2026', service: 'Psicología', professional: 'Dr. Roberto Soto', notes: 'Evaluación inicial por estrés académico. Se recomienda seguimiento.' },
  { id: 2, date: '02 JUL 2026', service: 'Servicio médico', professional: 'Dra. Javiera León', notes: 'Consulta general por cefalea. Derivación a dental sugerida.' }
]

const PATIENT_FILES = [
  { id: 1, name: 'Radiografía_Panoramica_2026.pdf', date: '01 SEP 2026', size: '2.4 MB' },
  { id: 2, name: 'Ficha_DAS_Ingreso.pdf', date: '15 MAR 2025', size: '1.1 MB' }
]

function Icon({ name, size = 20, strokeWidth = 1.9 }) {
  const paths = {
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />,
    sparkles: <><path d="m12 3-1.35 3.65L7 8l3.65 1.35L12 13l1.35-3.65L17 8l-3.65-1.35L12 3Z"/><path d="m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14Z"/><path d="m19 13-.65 1.35L17 15l1.35.65L19 17l.65-1.35L21 15l-1.35-.65L19 13Z"/></>,
    brain: <><path d="M9.5 4.5A3 3 0 0 0 6.7 8 3.4 3.4 0 0 0 5 14.35 3.5 3.5 0 0 0 9.5 19"/><path d="M14.5 4.5A3 3 0 0 1 17.3 8a3.4 3.4 0 0 1 1.7 6.35 3.5 3.5 0 0 1-4.5 4.65"/><path d="M12 3v18M9 9.5a3 3 0 0 0 3 3M15 9.5a3 3 0 0 1-3 3"/></>,
    activity: <path d="M3 12h4l2.2-7 4.2 14 2.2-7H21" />,
    medical: <><path d="M9 3h6v18H9z"/><path d="M3 9h18v6H3z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    back: <path d="m15 18-6-6 6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M10 19h4"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>,
    plus: <><path d="M12 5v14M5 12h14"/></>
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Logo() {
  return <div className="brand" aria-label="Bienestar USM"><div className="brand-mark"><span>U</span></div><div><strong>Bienestar USM</strong><small>Portal de atención</small></div></div>
}

function AppHeader({ activeSection, bookingCount, onNavigate, role, onToggleRole }) {
  const isStaff = role === 'staff'
  const links = isStaff 
    ? [{ id: 'dashboard', label: 'Agenda Diaria' }, { id: 'patients', label: 'Pacientes' }]
    : [{ id: 'home', label: 'Inicio' }, { id: 'reserve', label: 'Reservar' }, { id: 'appointments', label: 'Mis horas' }, { id: 'history', label: 'Historial' }]
  
  const profileData = isStaff ? STAFF_USER : USER

  return <header className="topbar"><div className="topbar-inner"><button className="brand-button" onClick={() => onNavigate(isStaff ? 'dashboard' : 'home')}><Logo /></button><nav className="main-nav" aria-label="Navegación principal">{links.map(link => <button key={link.id} className={activeSection === link.id ? 'active' : ''} aria-current={activeSection === link.id ? 'page' : undefined} onClick={() => onNavigate(link.id)}>{link.label}{link.id === 'appointments' && bookingCount > 0 && <span className="nav-badge">{bookingCount}</span>}</button>)}</nav><div className="header-actions"><button onClick={onToggleRole} className="text-button" style={{color: 'var(--blue)', fontWeight: 700}}>Modo: {isStaff ? 'Funcionario' : 'Alumno'}</button><button className="icon-button" aria-label="Notificaciones"><Icon name="bell" /></button><div className="profile"><span className="profile-avatar" style={isStaff ? {background: '#7c3aed', color: '#fff'} : {}}>{profileData.initials}</span><span className="profile-copy"><strong>{profileData.name}</strong><small>{isStaff ? profileData.role : 'Estudiante'}</small></span></div></div></div></header>
}

// === COMPONENTES DE ESTUDIANTE (Existentes) ===
function Progress({ step }) { /* ... omitido por espacio, mantener original ... */ }
function ServiceCard({ service, onSelect }) { /* ... mantener original ... */ }
function BookingCard({ booking, onCancel }) { /* ... mantener original ... */ }
function Dashboard({ section, bookings, onStart, onCancel, onNavigate }) { /* ... mantener original ... */ }
function ProfessionalsView({ service, onBack, onSelect }) { /* ... mantener original ... */ }
function ScheduleView({ service, professional, onBack, onHome, onConfirm }) { /* ... mantener original ... */ }
function SuccessToast({ booking, onClose }) { /* ... mantener original ... */ }

// === NUEVOS COMPONENTES DE FUNCIONARIO ===

function StaffDashboard({ onSelectPatient }) {
  return (
    <main className="page-shell staff-dashboard">
      <div className="page-heading">
        <span className="eyebrow">SEPTIEMBRE 8, 2026</span>
        <h1>Agenda del día</h1>
        <p>Tienes {PATIENTS_TODAY.filter(p => p.status === 'pending').length} pacientes pendientes hoy en Edificio F.</p>
      </div>
      <div className="patient-list">
        {PATIENTS_TODAY.map(patient => (
          <article key={patient.id} className="patient-card" onClick={() => onSelectPatient(patient)}>
            <div className="patient-info">
              <span className="patient-time">{patient.time}</span>
              <div className="patient-details">
                <h3>{patient.name}</h3>
                <p>{patient.rut} · {patient.career}</p>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
              <span className={`status-badge ${patient.status}`}>
                {patient.status === 'pending' ? 'Por Atender' : 'Atendido'}
              </span>
              <Icon name="chevron" color="#8795a7" />
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

function ReferralModal({ onClose, onConfirm }) {
  const [service, setService] = useState('psicologia')
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-content" onMouseDown={e => e.stopPropagation()}>
        <div className="section-heading">
          <h2>Derivar Paciente</h2>
          <p>La solicitud se enviará al sistema del servicio seleccionado de forma interna.</p>
        </div>
        <div className="form-group">
          <label>Servicio de Destino</label>
          <select value={service} onChange={e => setService(e.target.value)}>
            {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Motivo clínico de derivación (Privado)</label>
          <textarea rows="4" placeholder="Indique las razones para la evaluación..." />
        </div>
        <div style={{display: 'flex', gap: '10px', marginTop: '24px'}}>
          <button className="primary-button" onClick={onConfirm} style={{marginTop: 0}}>Enviar Derivación</button>
          <button className="secondary-button" onClick={onClose} style={{marginTop: 0}}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

function StaffPatientView({ patient, onBack }) {
  const [tab, setTab] = useState('resumen')
  const [showReferral, setShowReferral] = useState(false)

  return (
    <div style={{background: '#f5f7fb', minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <div className="patient-view-header">
        <div className="page-shell">
          <div>
            <button className="back-button" onClick={onBack}><Icon name="back" size={19} /> Volver a la agenda</button>
            <h1 style={{fontSize: '32px', margin: '10px 0 5px'}}>{patient.name}</h1>
            <p style={{margin: 0, color: 'var(--muted)'}}>{patient.rut} · {patient.career}</p>
          </div>
          <button className="inline-primary" onClick={() => setShowReferral(true)}>
            <Icon name="activity" size={17} /> Derivar paciente
          </button>
        </div>
      </div>

      <main className="page-shell">
        <div className="patient-tabs">
          <button className={tab === 'resumen' ? 'active' : ''} onClick={() => setTab('resumen')}>Resumen General</button>
          <button className={tab === 'historial' ? 'active' : ''} onClick={() => setTab('historial')}>Historial Multidisciplinario</button>
          <button className={tab === 'archivos' ? 'active' : ''} onClick={() => setTab('archivos')}>Archivos Médicos</button>
        </div>

        <div className="tab-content">
          {tab === 'resumen' && (
            <div>
              <h3>Antecedentes del Estudiante</h3>
              <div className="data-grid">
                <div className="data-item"><small>Beneficios</small><strong>{patient.benefits}</strong></div>
                <div className="data-item"><small>Previsión de Salud</small><strong>{patient.health}</strong></div>
                <div className="data-item"><small>Condiciones Crónicas</small><strong>{patient.conditions}</strong></div>
                <div className="data-item"><small>Medicamentos Actuales</small><strong>{patient.meds}</strong></div>
              </div>
            </div>
          )}

          {tab === 'historial' && (
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                <h3>Atenciones en otros servicios</h3>
                <span className="prototype-note" style={{marginTop: 0, padding: '6px 12px'}}><Icon name="shield" size={14}/> Acceso restringido autorizado</span>
              </div>
              <div className="history-list">
                {PATIENT_HISTORY.map(record => (
                  <article key={record.id} style={{alignItems: 'start'}}>
                    <span className="history-date" style={{background: '#f0eafd', color: '#7048c8'}}>
                      <strong>{record.date.split(' ')[0]}</strong><small>{record.date.split(' ')[1]}</small>
                    </span>
                    <div>
                      <h2>{record.service}</h2>
                      <p style={{marginBottom: '6px'}}>{record.professional}</p>
                      <div className="booking-note" style={{background: '#fff', border: '1px solid #edf0f5'}}>{record.notes}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === 'archivos' && (
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>Documentos Clínicos Compartidos</h3>
                <button className="text-button" style={{color: 'var(--blue)'}}>+ Subir archivo</button>
              </div>
              <div className="files-grid">
                {PATIENT_FILES.map(file => (
                  <div key={file.id} className="file-card">
                    <div className="file-icon"><Icon name="file" size={24} /></div>
                    <strong style={{display: 'block', fontSize: '12.5px', marginBottom: '4px', wordBreak: 'break-all'}}>{file.name}</strong>
                    <small style={{color: 'var(--muted)', fontSize: '11px'}}>{file.date} · {file.size}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {showReferral && <ReferralModal onClose={() => setShowReferral(false)} onConfirm={() => { alert('Derivación interna enviada exitosamente'); setShowReferral(false) }} />}
    </div>
  )
}

function StaffFlow() {
  const [view, setView] = useState('dashboard')
  const [patient, setPatient] = useState(null)

  if (view === 'patient' && patient) {
    return <StaffPatientView patient={patient} onBack={() => { setView('dashboard'); setPatient(null); window.scrollTo(0,0) }} />
  }
  return (
    <div className="app">
      <StaffDashboard onSelectPatient={(p) => { setPatient(p); setView('patient'); window.scrollTo(0,0) }} />
    </div>
  )
}

export default function App() {
  const [role, setRole] = useState('student')
  const [view, setView] = useState('dashboard')
  const [section, setSection] = useState('home')
  const [service, setService] = useState(null)
  const [professional, setProfessional] = useState(null)
  const [toastBooking, setToastBooking] = useState(null)
  const [bookings, setBookings] = useState([{ id: 101, service: 'Bienestar estudiantil', professional: 'Eliana Ponce', dateLabel: 'Jueves 10 de septiembre', dateShort: '10 sep 2026', time: '10:00' }])
  
  const pageTitle = useMemo(() => role === 'staff' ? 'Portal Funcionarios · Bienestar USM' : (view === 'dashboard' ? `${section === 'home' ? 'Inicio' : section === 'reserve' ? 'Reservar' : section === 'appointments' ? 'Mis horas' : 'Historial'} · Bienestar USM` : `Reservar · ${service?.name || 'Bienestar USM'}`), [view, section, service, role])
  document.title = pageTitle

  const navigate = target => { setView('dashboard'); setSection(target); setService(null); setProfessional(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const goHome = () => navigate('home')
  const startBooking = selected => { setService(selected); setView('professionals'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const selectProfessional = selected => { setProfessional(selected); setView('schedule'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const confirmBooking = (day, time) => { const next = { id: Date.now(), service: service.name, professional: professional.name, dateLabel: day.label.charAt(0).toUpperCase() + day.label.slice(1), dateShort: `${day.day} sep 2026`, time }; setBookings(current => [...current, next]); setToastBooking(next); goHome() }
  
  return (
    <div className="app">
      <AppHeader activeSection={role === 'staff' ? (view === 'dashboard' ? 'dashboard' : 'patients') : (view === 'dashboard' ? section : 'reserve')} bookingCount={bookings.length} onNavigate={navigate} role={role} onToggleRole={() => { setRole(role === 'student' ? 'staff' : 'student'); setView('dashboard'); setSection('home') }} />
      
      {role === 'staff' ? (
        <StaffFlow />
      ) : (
        <>
          {view === 'dashboard' && <Dashboard section={section} bookings={bookings} onStart={startBooking} onCancel={id => setBookings(current => current.filter(item => item.id !== id))} onNavigate={navigate} />}
          {view === 'professionals' && <ProfessionalsView service={service} onBack={() => navigate('reserve')} onSelect={selectProfessional} />}
          {view === 'schedule' && <ScheduleView service={service} professional={professional} onBack={() => setView('professionals')} onHome={goHome} onConfirm={confirmBooking} />}
        </>
      )}
      
      <footer><span>© 2026 Universidad Técnica Federico Santa María</span><span>Prototipo de reservas · Proyecto 3</span></footer>
      <SuccessToast booking={toastBooking} onClose={() => setToastBooking(null)} />
    </div>
  )
}