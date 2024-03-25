import React from "react";
import LOGO from "../../assets/logo.png";
import classNames from 'classnames'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DASHBOARD_SIDEBAR_LINKS } from "../../lib/const/navigation";
import { HiOutlineLogout } from 'react-icons/hi'

const linkClass =
	'flex items-center gap-4 font-light w-48 h-12 px-5 py-5 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-3xl text-base'
export default function Sidebar() {
	const navigate = useNavigate()
	const Logout = () => {
		localStorage.clear()
		navigate("/", {replace: true})
	}
  return (
    <div className="text-white bg-[#060606] p-3 flex flex-col w-60">
      <div className="flex items-center gap-2 px-2 py-3">
        <img src={LOGO} alt="metamask" className="h-4" />
        <h1 className="text-xl font-bold mr-auto">blockvote</h1>
      </div>
      <div className="flex flex-1 flex-col gap-3 py-8 ">
      <p className="text-neutral-500 text-sm font-medium tracking-wide pb-2">Dashboard</p>
				{DASHBOARD_SIDEBAR_LINKS.map((link) => (
					<SidebarLink key={link.key} link={link} />
				))}
			</div>
			<div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
				{/* {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
					<SidebarLink key={link.key} link={link} />
				))} */}
				<button className={classNames(linkClass, 'cursor-pointer text-red-500 text-xl')} onClick={Logout}>
						<HiOutlineLogout />
					Logout
				</button>
			</div>
		</div>
  );
}


function SidebarLink({ link }) {
	const { pathname } = useLocation()

	return (
		<Link
			to={link.path}
			className={classNames(pathname === link.path ? 'bg-[#151515] text-white' : 'text-neutral-400', linkClass)}
		>
			<span className="text-xl">{link.icon}</span>
			{link.label}
		</Link>
	)
}