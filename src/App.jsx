import { useEffect, useRef, useState } from 'react'

const USER = { name: 'Gabriel Lira', firstName: 'Gabriel' }

// 1. CREAMOS PERFILES DE FUNCIONARIOS CON DISTINTOS ROLES
const STAFF_PROFILES = [
  { id: 'dental', name: 'Dra. Fernanda Zamora', initials: 'FZ', role: 'Cirujana dentista' },
  { id: 'bienestar', name: 'Eliana Ponce', initials: 'EP', role: 'Asistente social' },
  { id: 'psicologia', name: 'Dr. Roberto Soto', initials: 'RS', role: 'Psicólogo clínico' },
]

// 2. DEFINIMOS LOS PERMISOS POR ESPECIALIDAD
const ROLE_PERMISSIONS = {
  dental: {
    canSeeBenefits: false,
    canSeeMeds: true,
    allowedHistory: ['Servicio médico', 'Servicio dental'],
    allowedFiles: ['Radiografía_Panoramica_2026.pdf']
  },
  bienestar: {
    canSeeBenefits: true,
    canSeeMeds: false,
    allowedHistory: ['Bienestar estudiantil', 'Psicología'],
    allowedFiles: ['Ficha_DAS_Ingreso.pdf']
  },
  psicologia: {
    canSeeBenefits: true,
    canSeeMeds: true,
    allowedHistory: ['Psicología', 'Servicio médico', 'Bienestar estudiantil', 'Servicio dental'],
    allowedFiles: ['Ficha_DAS_Ingreso.pdf', 'Radiografía_Panoramica_2026.pdf']
  }
}

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
  { id: 'p1', service: 'psicologia', time: '09:00', name: 'Axel González', rut: '20.123.456-7', status: 'pending', career: 'Ingeniería Civil en Informática', benefits: 'Gratuidad, Beca de Alimentación', health: 'Fonasa B', conditions: 'Hipertensión leve', meds: 'Losartán 50mg' },
  { id: 'p2', service: 'dental', time: '09:45', name: 'Samira Estay', rut: '21.345.678-9', status: 'attended', career: 'Arquitectura', benefits: 'Beca Bicentenario', health: 'Isapre', conditions: 'Ninguna', meds: 'Ninguno' },
  { id: 'p3', service: 'bienestar', time: '11:15', name: 'Vicente Pacheco', rut: '20.987.654-3', status: 'pending', career: 'Ingeniería Civil Electrónica', benefits: 'CAE, Fondo Solidario', health: 'Fonasa C', conditions: 'Asma', meds: 'Salbutamol PRN' },
  { id: 'p4', service: 'dental', time: '10:30', name: 'Martina Rojas', rut: '21.456.789-0', status: 'pending', career: 'Ingeniería Comercial', benefits: 'Beca de Alimentación', health: 'Fonasa A', conditions: 'Ninguna', meds: 'Ninguno' },
  { id: 'p5', service: 'psicologia', time: '12:00', name: 'Diego Contreras', rut: '20.765.432-1', status: 'pending', career: 'Ingeniería Civil Mecánica', benefits: 'Gratuidad', health: 'Isapre', conditions: 'Ninguna', meds: 'Ninguno' },
  { id: 'p6', service: 'bienestar', time: '09:45', name: 'Catalina Mora', rut: '21.234.567-8', status: 'attended', career: 'Ingeniería Civil Química', benefits: 'CAE', health: 'Fonasa B', conditions: 'Ninguna', meds: 'Ninguno' }
]

const PATIENT_HISTORY = [
  { id: 1, date: '15 AGO 2026', service: 'Psicología', professional: 'Dr. Roberto Soto', notes: 'Evaluación inicial por estrés académico. Se recomienda seguimiento.' },
  { id: 2, date: '02 JUL 2026', service: 'Servicio médico', professional: 'Dra. Javiera León', notes: 'Consulta general por cefalea. Derivación a dental sugerida.' }
]

const PATIENT_FILES = [
  { id: 1, name: 'Radiografía_Panoramica_2026.pdf', date: '01 SEP 2026', size: '2.4 MB' },
  { id: 2, name: 'Ficha_DAS_Ingreso.pdf', date: '15 MAR 2025', size: '1.1 MB' }
]

const ICON_PATHS = {
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
  chevron: <path d="m9 18 6-6-6-6"/>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></>
}

function Icon({ name, size = 20, strokeWidth = 1.9 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON_PATHS[name]}</svg>
}

function Logo() {
  return <div className="brand" aria-label="Bienestar USM"><div className="brand-mark"><span>U</span></div><div><strong>Bienestar USM</strong><small>Portal de atención</small></div></div>
}

function AppHeader({ activeSection, bookingCount, onNavigate, role, onToggleRole, staffUser, setStaffUser }) {
  const isStaff = role === 'staff'
  // El modo funcionario no tiene navegación en el header: solo el logo, el selector de funcionario (debug) y el switch
  const links = isStaff ? [] : [{ id: 'home', label: 'Inicio' }, { id: 'reserve', label: 'Reservar' }, { id: 'appointments', label: 'Mis horas' }, { id: 'history', label: 'Historial' }]

  const profileData = isStaff ? staffUser : USER

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand-button" aria-label={`Ir al inicio de ${isStaff ? 'funcionario' : 'alumno'}`} onClick={() => onNavigate(isStaff ? 'dashboard' : 'home')}><Logo /></button>
        <nav className="main-nav" aria-label="Navegación principal">
          {links.map(link => <button key={link.id} className={activeSection === link.id ? 'active' : ''} aria-current={activeSection === link.id ? 'page' : undefined} onClick={() => onNavigate(link.id)}>{link.label}{link.id === 'appointments' && bookingCount > 0 && <span className="nav-badge">{bookingCount}</span>}</button>)}
        </nav>
        <div className="header-actions">
          <div className="profile">
            <div className="profile-copy">
              {/* MODO DEBUG: cambia de funcionario para ver la página según sus permisos */}
              {isStaff ? (
                <select className="profile-select" aria-label="Cambiar funcionario (modo debug)" value={staffUser.id} onChange={(e) => setStaffUser(STAFF_PROFILES.find(p => p.id === e.target.value))}>
                  {STAFF_PROFILES.map(prof => <option key={prof.id} value={prof.id}>{prof.name}</option>)}
                </select>
              ) : (
                <strong>{profileData.name}</strong>
              )}
              <small>{isStaff ? profileData.role : 'Estudiante'}</small>
            </div>
          </div>
          <button type="button" role="switch" aria-checked={isStaff} aria-label="Cambiar modo alumno o funcionario" className={`role-switch ${isStaff ? 'staff' : ''}`} onClick={onToggleRole}>
            <span className="role-switch-thumb" />
            <span className="role-switch-label">Alumno</span>
            <span className="role-switch-label">Funcionario</span>
          </button>
        </div>
      </div>
    </header>
  )
}

// === COMPONENTES DE ESTUDIANTE ===
function Progress({ step }) {
  const labels = ['Servicio', 'Profesional', 'Fecha y hora']
  return <div className="progress" aria-label={`Paso ${step} de 3`}>{labels.map((label, index) => { const number = index + 1; const done = number < step; const active = number === step; return <div className={`progress-item ${done ? 'done' : ''} ${active ? 'active' : ''}`} key={label}><span>{done ? <Icon name="check" size={15} strokeWidth={2.5} /> : number}</span><p>{label}</p></div> })}</div>
}

function ServiceCard({ service, onSelect }) {
  return <button className="service-card" onClick={() => onSelect(service)}><span className={`service-icon ${service.tone}`}><Icon name={service.icon} size={22} /></span><span className="service-content"><strong>{service.name}</strong><small>{service.description}</small><em><span className="status-dot" /> Próxima hora: {service.next}</em></span><span className="service-arrow"><Icon name="chevron" size={19} /></span></button>
}

function BookingCard({ booking, onCancel }) {
  return <article className="booking-card"><div className="booking-accent" /><div className="booking-topline"><span className="pill confirmed"><span /> Confirmada</span><button className="text-button danger" onClick={() => onCancel(booking.id)}>Anular hora</button></div><h3>{booking.service}</h3><p className="booking-professional">{booking.professional}</p><div className="booking-details"><span><Icon name="calendar" size={18} />{booking.dateLabel}</span><span><Icon name="clock" size={18} />{booking.time} hrs.</span><span><Icon name="location" size={18} />Edificio F · Campus Casa Central</span></div><div className="booking-note"><Icon name="shield" size={17} /> Llega 10 minutos antes y lleva tu credencial universitaria.</div></article>
}

function Dashboard({ section, bookings, onStart, onCancel, onNavigate }) {
  if (section === 'reserve') return <main className="page-shell section-page"><Progress step={1} /><div className="page-heading"><span className="eyebrow">NUEVA RESERVA</span><h1>Elige un servicio</h1><p>Consulta la próxima disponibilidad y comienza tu reserva.</p></div><div className="services-grid services-page">{SERVICES.map(item => <ServiceCard key={item.id} service={item} onSelect={onStart} />)}</div><div className="prototype-note"><Icon name="shield" size={18} /><p>Todos los horarios y profesionales son datos simulados para este prototipo.</p></div></main>
  if (section === 'appointments') return <main className="page-shell section-page narrow-page"><div className="page-heading"><span className="eyebrow">AGENDA PERSONAL</span><h1>Mis horas</h1><p>Revisa y administra tus próximas atenciones.</p></div><div className="appointments-list">{bookings.length ? bookings.map(item => <BookingCard key={item.id} booking={item} onCancel={onCancel} />) : <div className="empty-state"><span><Icon name="calendar" size={26} /></span><h3>No tienes horas agendadas</h3><p>Cuando reserves una atención aparecerá en esta sección.</p><button className="inline-primary" onClick={() => onNavigate('reserve')}>Reservar una hora</button></div>}</div></main>
  if (section === 'history') return <main className="page-shell section-page narrow-page"><div className="page-heading"><span className="eyebrow">ATENCIONES ANTERIORES</span><h1>Historial</h1><p>Registro simulado de tus atenciones realizadas.</p></div><div className="history-list"><article><span className="history-date"><strong>15</strong><small>AGO</small></span><div><span className="pill attended"><Icon name="check" size={13} /> Realizada</span><h2>Psicología</h2><p>Dr. Roberto Soto · 15:30 hrs.</p></div></article><article><span className="history-date"><strong>02</strong><small>JUL</small></span><div><span className="pill attended"><Icon name="check" size={13} /> Realizada</span><h2>Servicio médico</h2><p>Dra. Javiera León · 11:00 hrs.</p></div></article></div><p className="history-disclaimer"><Icon name="shield" size={16} /> Información de demostración. Este prototipo no almacena datos médicos.</p></main>
  const nextBooking = bookings[0]
  return <main className="page-shell dashboard"><section className="welcome"><div><span className="eyebrow">DOMINGO, 6 DE SEPTIEMBRE</span><h1>Hola, {USER.firstName} <span>👋</span></h1><p>Tu bienestar universitario, en un solo lugar.</p></div></section><div className="home-grid"><section className="home-action"><span className="home-action-icon"><Icon name="calendar" size={26} /></span><div><span className="eyebrow">ACCESO RÁPIDO</span><h2>Agenda tu próxima atención</h2><p>Encuentra un servicio, profesional y horario en pocos pasos.</p><button className="inline-primary" onClick={() => onNavigate('reserve')}>Reservar nueva hora <Icon name="arrow" size={17} /></button></div></section><section className="home-next"><div className="section-heading"><h2>Tu próxima hora</h2><button className="text-link" onClick={() => onNavigate('appointments')}>Ver todas</button></div>{nextBooking ? <BookingCard booking={nextBooking} onCancel={onCancel} /> : <div className="empty-state compact-empty"><h3>Sin reservas próximas</h3><p>Puedes agendar desde la pestaña Reservar.</p></div>}</section></div><section className="home-shortcuts"><button onClick={() => onNavigate('appointments')}><span><Icon name="clock" /></span><div><strong>Mis horas</strong><small>Administra tus reservas</small></div><Icon name="chevron" /></button><button onClick={() => onNavigate('history')}><span><Icon name="check" /></span><div><strong>Historial</strong><small>Revisa atenciones anteriores</small></div><Icon name="chevron" /></button></section></main>
}

function ProfessionalsView({ service, onBack, onSelect }) {
  const professionals = PROFESSIONALS[service.id] || []
  const [profile, setProfile] = useState(null)
  return <main className="page-shell flow-page"><button className="back-button" onClick={onBack}><Icon name="back" size={19} /> Volver a servicios</button><Progress step={2} /><div className="flow-heading"><span className={`service-icon ${service.tone}`}><Icon name={service.icon} size={23} /></span><div><span className="eyebrow">{service.name}</span><h1>Elige un profesional</h1><p>Revisa su perfil o consulta directamente sus horas disponibles.</p></div></div><div className="professional-grid">{professionals.map(prof => <article className="professional-card" key={prof.id}><span className="professional-avatar" style={{ '--avatar': prof.color }}>{prof.initials}</span><span className="professional-info"><strong>{prof.name}</strong><small>{prof.role}</small><em><span className="status-dot" /> Disponible {prof.next}</em></span><span className="professional-actions"><button className="profile-button" onClick={() => setProfile(prof)}>Ver perfil</button><button className="select-cta" onClick={() => onSelect(prof)}>Ver horas <Icon name="arrow" size={17} /></button></span></article>)}</div><div className="prototype-note"><Icon name="shield" size={18} /><p><strong>Información de prototipo</strong> Los perfiles, profesionales y horarios son datos de demostración.</p></div>
  {profile && <div className="profile-overlay" role="presentation" onMouseDown={() => setProfile(null)}><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title" onMouseDown={event => event.stopPropagation()}><button className="modal-close" onClick={() => setProfile(null)} aria-label="Cerrar perfil">×</button><div className="profile-hero"><span className="professional-avatar profile-avatar-large" style={{ '--avatar': profile.color }}>{profile.initials}</span><div><span className="eyebrow">FICHA PROFESIONAL</span><h2 id="profile-title">{profile.name}</h2><p>{profile.role}</p></div></div><div className="profile-facts"><div><small>Modalidad</small><strong>Presencial</strong></div><div><small>Duración</small><strong>45 minutos</strong></div><div><small>Próxima hora</small><strong>{profile.next}</strong></div></div><div className="profile-section"><h3>Sobre el profesional</h3><p>{PROFILE_DETAILS[profile.id].bio}</p></div><div className="profile-section"><h3>Áreas de atención</h3><div className="area-chips">{PROFILE_DETAILS[profile.id].areas.map(area => <span key={area}>{area}</span>)}</div></div><div className="profile-contact"><p><small>Correo institucional</small><strong>{PROFILE_DETAILS[profile.id].email}</strong></p><p><small>Lugar de atención</small><strong>Edificio F · Campus Casa Central</strong></p></div><button className="primary-button profile-cta" onClick={() => onSelect(profile)}>Ver horas disponibles <Icon name="arrow" size={17} /></button></section></div>}
  </main>
}

function ScheduleView({ service, professional, onBack, onHome, onConfirm }) {
  const [day, setDay] = useState(DAYS[0]); const [time, setTime] = useState(null)
  return <main className="page-shell flow-page schedule-page"><button className="back-button" onClick={onBack}><Icon name="back" size={19} /> Cambiar profesional</button><Progress step={3} /><div className="flow-heading simple"><div><span className="eyebrow">{service.name}</span><h1>Elige fecha y hora</h1><p>Horarios disponibles con {professional.name}.</p></div></div><div className="schedule-layout">
    <section className="calendar-card"><div className="professional-summary"><span className="professional-avatar small" style={{ '--avatar': professional.color }}>{professional.initials}</span><div><strong>{professional.name}</strong><small>{professional.role}</small></div><span className="online-status"><span /> Disponible</span></div><div className="calendar-section"><div className="calendar-title"><div><h2>Septiembre 2026</h2><p>Selecciona un día disponible</p></div><span>4 días disponibles</span></div><div className="days-row">{DAYS.map(item => <button key={item.iso} className={`day-button ${day.iso === item.iso ? 'selected' : ''}`} onClick={() => { setDay(item); setTime(null) }}><span>{item.weekday}</span><strong>{item.day}</strong><small>{item.month}</small></button>)}</div></div><div className="times-section"><div className="times-heading"><h2>Horas disponibles</h2><span><span className="status-dot" /> {TIMES.length} horarios</span></div><div className="times-grid">{TIMES.map(item => <button key={item} className={time === item ? 'selected' : ''} onClick={() => setTime(item)}>{item}</button>)}</div></div></section>
    <aside className="summary-card"><span className="eyebrow">RESUMEN DE TU HORA</span><h2>{service.name}</h2><div className="summary-list"><div><span><Icon name="heart" /></span><p><small>Profesional</small><strong>{professional.name}</strong></p></div><div><span><Icon name="calendar" /></span><p><small>Fecha</small><strong>{day.label}</strong></p></div><div><span><Icon name="clock" /></span><p><small>Hora</small><strong>{time ? `${time} hrs.` : 'Selecciona un horario'}</strong></p></div><div><span><Icon name="location" /></span><p><small>Lugar</small><strong>Edificio F · Casa Central</strong></p></div></div><button className="primary-button" disabled={!time} onClick={() => onConfirm(day, time)}><Icon name="check" size={18} /> Confirmar reserva</button><button className="secondary-button" onClick={onHome}>Cancelar y volver</button><p className="privacy-copy"><Icon name="shield" size={15} /> Esta es una reserva simulada para el prototipo.</p></aside>
  </div></main>
}

function CancelBookingModal({ booking, onKeep, onConfirm }) {
  if (!booking) return null
  return <div className="profile-overlay" role="presentation" onMouseDown={onKeep}><section className="profile-modal confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="cancel-title" onMouseDown={event => event.stopPropagation()}><span className="confirm-icon"><Icon name="shield" size={24} /></span><h2 id="cancel-title">¿Anular esta hora?</h2><p>{booking.service} con {booking.professional}<br /><strong>{booking.dateLabel} · {booking.time} hrs.</strong></p><p className="confirm-warning">Esta acción no se puede deshacer y el horario quedará disponible para otros estudiantes.</p><div className="confirm-actions"><button className="primary-button" autoFocus onClick={onKeep}>Cancelar</button><button className="text-button danger confirm-destructive" onClick={onConfirm}>Sí, anular hora</button></div></section></div>
}

function SuccessToast({ booking, onClose }) {
  if (!booking) return null
  return <div className="toast" role="status"><span><Icon name="check" size={19} strokeWidth={2.5} /></span><div><strong>Hora reservada</strong><p>{booking.dateShort} · {booking.time} hrs.</p></div><button onClick={onClose} aria-label="Cerrar">×</button></div>
}

// === COMPONENTES DE FUNCIONARIO ===

function StaffDashboard({ staffUser, onSelectPatient }) {
  const patients = PATIENTS_TODAY.filter(p => p.service === staffUser.id).sort((a, b) => a.time.localeCompare(b.time))
  return (
    <main className="page-shell staff-dashboard">
      <div className="page-heading">
        <span className="eyebrow">SEPTIEMBRE 8, 2026</span>
        <h1>Agenda del día</h1>
        <p>Tienes {patients.filter(p => p.status === 'pending').length} pacientes pendientes hoy en Edificio F.</p>
      </div>
      <div className="patient-list">
        {patients.length === 0 && <p>No tienes pacientes agendados hoy.</p>}
        {patients.map(patient => (
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

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

const formatSize = bytes => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

// Vista previa simulada para los documentos de ejemplo (no tienen contenido real)
function MockDocument({ file, patient }) {
  if (file.name.startsWith('Radiografía')) {
    const teeth = Array.from({ length: 14 }, (_, i) => {
      const t = (i + 0.5) / 14; const x = (1 - t) ** 2 * 70 + 2 * (1 - t) * t * 250 + t ** 2 * 430; const y = (1 - t) ** 2 * 120 + 2 * (1 - t) * t * 270 + t ** 2 * 120
      return <rect key={i} x={x - 9} y={y - 26} width="18" height="40" rx="7" fill="#e8edf3" opacity=".75" />
    })
    return (
      <svg className="mock-xray" viewBox="0 0 500 300" role="img" aria-label="Radiografía panorámica simulada">
        <defs><filter id="xray-blur"><feGaussianBlur stdDeviation="9" /></filter></defs>
        <rect width="500" height="300" fill="#0b1018" />
        <path d="M40 110 Q250 300 460 110" stroke="#9aa6b6" strokeWidth="70" fill="none" opacity=".35" filter="url(#xray-blur)" />
        {teeth}
        <text x="16" y="24" fill="#8a96a8" fontSize="11" fontFamily="monospace">{patient.name.toUpperCase()} · {patient.rut}</text>
        <text x="16" y="286" fill="#8a96a8" fontSize="11" fontFamily="monospace">PANORÁMICA · {file.date}</text>
      </svg>
    )
  }
  return (
    <article className="mock-page">
      <header><strong>{file.name.replace(/_/g, ' ').replace('.pdf', '')}</strong><small>Universidad Técnica Federico Santa María · {file.date}</small></header>
      <dl>
        <div><dt>Nombre</dt><dd>{patient.name}</dd></div>
        <div><dt>RUT</dt><dd>{patient.rut}</dd></div>
        <div><dt>Carrera</dt><dd>{patient.career}</dd></div>
      </dl>
      {[92, 100, 84, 96, 70, 100, 88, 60].map((width, i) => <span key={i} className="mock-line" style={{ width: `${width}%` }} />)}
    </article>
  )
}

function FilePreviewModal({ file, patient, onClose }) {
  const kind = !file.url ? 'mock' : file.type.startsWith('image/') ? 'image' : (file.type === 'application/pdf' || file.type.startsWith('text/')) ? 'frame' : 'none'
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <section className="modal-content preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-title" onMouseDown={e => e.stopPropagation()}>
        <div className="preview-header">
          <div><h2 id="preview-title">{file.name}</h2><small>{file.date} · {file.size}</small></div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar vista previa">×</button>
        </div>
        <div className="preview-body">
          {kind === 'mock' && <MockDocument file={file} patient={patient} />}
          {kind === 'image' && <img src={file.url} alt={file.name} />}
          {kind === 'frame' && <iframe src={file.url} title={file.name} />}
          {kind === 'none' && <p className="restricted-note"><Icon name="file" size={16} /> No hay vista previa disponible para este tipo de archivo.</p>}
        </div>
      </section>
    </div>
  )
}

function StaffPatientView({ patient, onBack, staffUser, uploadedFiles, onUpload }) {
  const [tab, setTab] = useState('resumen')
  const [showReferral, setShowReferral] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const fileInput = useRef(null)

  // Obtenemos los permisos del funcionario actual
  const perms = ROLE_PERMISSIONS[staffUser.id]
  const allowedHistory = PATIENT_HISTORY.filter(record => perms.allowedHistory.includes(record.service))
  const allowedFiles = [...uploadedFiles, ...PATIENT_FILES.filter(file => perms.allowedFiles.includes(file.name))]

  const handleUpload = event => {
    const picked = [...event.target.files]
    event.target.value = ''
    const tooBig = picked.filter(file => file.size > MAX_UPLOAD_BYTES)
    setUploadError(tooBig.length ? `${tooBig.map(file => file.name).join(', ')} supera el máximo de 10 MB.` : '')
    const valid = picked.filter(file => file.size <= MAX_UPLOAD_BYTES)
    if (valid.length) onUpload(valid.map(file => ({ id: `${Date.now()}-${file.name}`, name: file.name, date: '08 SEP 2026', size: formatSize(file.size), type: file.type, url: URL.createObjectURL(file), uploaded: true })))
  }

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
          <button className={tab === 'archivos' ? 'active' : ''} onClick={() => setTab('archivos')}>Archivos Compartidos</button>
        </div>

        <div className="tab-content">
          {tab === 'resumen' && (
            <div>
              <h3>Antecedentes del Estudiante</h3>
              <div className="data-grid">
                
                {/* Lógica de Privacidad: Beneficios */}
                {perms.canSeeBenefits ? (
                  <>
                    <div className="data-item"><small>Beneficios Financieros</small><strong>{patient.benefits}</strong></div>
                    <div className="data-item"><small>Previsión de Salud</small><strong>{patient.health}</strong></div>
                  </>
                ) : (
                  <p className="restricted-note"><Icon name="shield" size={16} /> Su rol no está autorizado para ver datos socioeconómicos.</p>
                )}

                {/* Lógica de Privacidad: Clínica */}
                {perms.canSeeMeds ? (
                  <>
                    <div className="data-item"><small>Condiciones Crónicas</small><strong>{patient.conditions}</strong></div>
                    <div className="data-item"><small>Medicamentos Actuales</small><strong>{patient.meds}</strong></div>
                  </>
                ) : (
                  <p className="restricted-note"><Icon name="shield" size={16} /> Su rol no está autorizado para ver datos médicos.</p>
                )}
              </div>
            </div>
          )}

          {tab === 'historial' && (
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                <h3>Atenciones en otros servicios</h3>
                <span className="prototype-note" style={{marginTop: 0, padding: '6px 12px'}}><Icon name="shield" size={14}/> Filtrado por permisos de {staffUser.role}</span>
              </div>
              
              {allowedHistory.length > 0 ? (
                <div className="history-list">
                  {allowedHistory.map(record => (
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
              ) : (
                <div className="empty-state">
                  <span><Icon name="shield" size={26} /></span>
                  <h3>Historial Oculto</h3>
                  <p>No existen registros que su rol esté autorizado a visualizar.</p>
                </div>
              )}
            </div>
          )}

          {tab === 'archivos' && (
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3>Documentos Clínicos Autorizados</h3>
                <button className="text-button" style={{color: 'var(--blue)'}} onClick={() => fileInput.current.click()}>+ Subir archivo</button>
                <input ref={fileInput} type="file" accept=".pdf,image/*,.txt" multiple hidden onChange={handleUpload} />
              </div>
              {uploadError && <p className="restricted-note upload-error"><Icon name="shield" size={16} /> {uploadError}</p>}

              {allowedFiles.length > 0 ? (
                <div className="files-grid">
                  {allowedFiles.map(file => (
                    <button key={file.id} className="file-card" onClick={() => setPreviewFile(file)} aria-label={`Ver vista previa de ${file.name}`}>
                      {file.uploaded && <span className="file-new">Nuevo</span>}
                      <div className="file-icon"><Icon name="file" size={24} /></div>
                      <strong style={{display: 'block', fontSize: '12.5px', marginBottom: '4px', wordBreak: 'break-all'}}>{file.name}</strong>
                      <small style={{color: 'var(--muted)', fontSize: '11px'}}>{file.date} · {file.size}</small>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span><Icon name="shield" size={26} /></span>
                  <h3>Archivos Protegidos</h3>
                  <p>Los documentos de este paciente no están compartidos con su especialidad.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {previewFile && <FilePreviewModal file={previewFile} patient={patient} onClose={() => setPreviewFile(null)} />}
      {showReferral && <ReferralModal onClose={() => setShowReferral(false)} onConfirm={() => { alert('Derivación interna enviada exitosamente'); setShowReferral(false) }} />}
    </div>
  )
}

function StaffFlow({ staffUser }) {
  const [view, setView] = useState('dashboard')
  const [patient, setPatient] = useState(null)
  // Archivos subidos en esta sesión, por paciente
  const [uploads, setUploads] = useState({})

  if (view === 'patient' && patient) {
    return <StaffPatientView patient={patient} onBack={() => { setView('dashboard'); setPatient(null); window.scrollTo(0,0) }} staffUser={staffUser} uploadedFiles={uploads[patient.id] || []} onUpload={files => setUploads(current => ({ ...current, [patient.id]: [...files, ...(current[patient.id] || [])] }))} />
  }
  return <StaffDashboard staffUser={staffUser} onSelectPatient={(p) => { setPatient(p); setView('patient'); window.scrollTo(0,0) }} />
}

const SECTION_TITLES = { home: 'Inicio', reserve: 'Reservar', appointments: 'Mis horas', history: 'Historial' }

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

export default function App() {
  const [role, setRole] = useState('student')
  const [staffUser, setStaffUser] = useState(STAFF_PROFILES[0])
  const [view, setView] = useState('dashboard')
  const [section, setSection] = useState('home')
  const [service, setService] = useState(null)
  const [professional, setProfessional] = useState(null)
  const [toastBooking, setToastBooking] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [staffKey, setStaffKey] = useState(0)
  const [bookings, setBookings] = useState([{ id: 101, service: 'Bienestar estudiantil', professional: 'Eliana Ponce', dateLabel: 'Jueves 10 de septiembre', dateShort: '10 sep 2026', time: '10:00' }])
  
  const pageTitle = role === 'staff' ? 'Portal Funcionarios · Bienestar USM' : (view === 'dashboard' ? `${SECTION_TITLES[section]} · Bienestar USM` : `Reservar · ${service?.name || 'Bienestar USM'}`)
  useEffect(() => { document.title = pageTitle }, [pageTitle])

  const navigate = target => { setStaffKey(key => key + 1); setView('dashboard'); setSection(target); setService(null); setProfessional(null); scrollToTop() }
  const goHome = () => navigate('home')
  const startBooking = selected => { setService(selected); setView('professionals'); scrollToTop() }
  const selectProfessional = selected => { setProfessional(selected); setView('schedule'); scrollToTop() }
  const confirmBooking = (day, time) => { const next = { id: Date.now(), service: service.name, professional: professional.name, dateLabel: day.label.charAt(0).toUpperCase() + day.label.slice(1), dateShort: `${day.day} sep 2026`, time }; setBookings(current => [...current, next]); setToastBooking(next); goHome() }
  
  return (
    <div className="app">
      <AppHeader activeSection={view === 'dashboard' ? section : 'reserve'} bookingCount={bookings.length} onNavigate={navigate} role={role} onToggleRole={() => { setRole(role === 'student' ? 'staff' : 'student'); setView('dashboard'); setSection('home') }} staffUser={staffUser} setStaffUser={setStaffUser} />

      {role === 'staff' ? (
        <StaffFlow key={`${staffKey}-${staffUser.id}`} staffUser={staffUser} />
      ) : (
        <>
          {view === 'dashboard' && <Dashboard section={section} bookings={bookings} onStart={startBooking} onCancel={id => setCancelTarget(bookings.find(item => item.id === id) || null)} onNavigate={navigate} />}
          {view === 'professionals' && <ProfessionalsView service={service} onBack={() => navigate('reserve')} onSelect={selectProfessional} />}
          {view === 'schedule' && <ScheduleView service={service} professional={professional} onBack={() => setView('professionals')} onHome={goHome} onConfirm={confirmBooking} />}
        </>
      )}
      
      {role === 'student' && <footer><span>Prototipo de reservas · Proyecto 3</span></footer>}
      <CancelBookingModal booking={cancelTarget} onKeep={() => setCancelTarget(null)} onConfirm={() => { setBookings(current => current.filter(item => item.id !== cancelTarget.id)); setCancelTarget(null) }} />
      <SuccessToast booking={toastBooking} onClose={() => setToastBooking(null)} />
    </div>
  )
}