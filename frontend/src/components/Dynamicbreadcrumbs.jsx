import React, { useState, useEffect } from 'react'
import { useLocation, Link, useParams } from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb"

const Dynamicbreadcrumbs = () => {
    const location = useLocation();
    const params = useParams()
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);

    useEffect(() => {
        const items = getBreadcrumbItems(location.pathname, params);
        setBreadcrumbItems(items);
    }, [location.pathname, params]);

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbSeparator />
                        {item}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

function getBreadcrumbItems(path, params) {
    const parts = path.split('/').filter(part => part !== ''); // Remove empty parts
    const lastPart = parts[parts.length - 1];

    const breadcrumbItems = parts.map((part, index) => {
        const href = `/${parts.slice(0, index + 1).join('/')}`;
        return (
            <BreadcrumbItem key={part}>
                {index === parts.length - 1 ? (
                    // Check if the last part is an ID parameter
                    params.id ? (
                        <BreadcrumbPage>{`Details`}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbPage>{part.charAt(0).toUpperCase() + part.slice(1)}</BreadcrumbPage>
                    )
                ) : (
                    <BreadcrumbLink asChild>
                        <Link to={href}>{part.charAt(0).toUpperCase() + part.slice(1)}</Link>
                    </BreadcrumbLink>
                )}
            </BreadcrumbItem>
        );
    });

    return breadcrumbItems;
}

export default Dynamicbreadcrumbs;




