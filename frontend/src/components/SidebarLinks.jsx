import { Link, useLocation } from 'react-router-dom';
import {
    CircleUser,
    Home,
    Menu,
    Package,
    Package2,
    ShoppingCart,
    Users,
} from "lucide-react"
import React from 'react';
function SidebarLink({ to, icon, text, classes }) {
  const location = useLocation();

  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${classes} ${
        isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
      }`}
    >
      {icon && React.createElement(icon, { className: 'h-4 w-4' })}
      {text}
    </Link>
  );
}

function SidebarLinks({classes}) {
  return (
    <>
      <SidebarLink to="/" text="Dashboard" icon={Home} classes={classes}/>
      <SidebarLink to="/invoices" text="Invoices" icon={ShoppingCart} classes={classes} />
      <SidebarLink to="/products" text="Products" icon={Package} classes={classes} />
      <SidebarLink to="/employees" text="Employees" icon={Users} classes={classes} />
    </>
  );
}

export default SidebarLinks;