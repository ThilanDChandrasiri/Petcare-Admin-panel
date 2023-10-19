import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {
    const [editedCategory,setEditedCategory] = useState('');
    const [name,setName] = useState('');
    const [parentCategory,setParentCategory] = useState('');
    const [categories,setCategories] = useState([]);
    const [properties,setProperties] = useState([{ name: '', values: '' }]);
    useEffect(() => {
        fetchCategories();
    }, [])
    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }
    async function saveCategory(ev){
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties:properties.map(p => ({
                name:p.name,
                values:p.values.split(','),
            })),
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }
    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name,values}) => ({
                name,
                values:values.join(',')
            }))
            );
    }
    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton:true,
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#574476',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#F3797E',
            reverseButtons: true,

        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        });
    }
    function addProperty() {
        setProperties(prev => {
           return [...prev, {name:'',values:''}]; 
        });
    }
    function handlePropertyNameChange(index,property,newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }
    function handlePropertyValuesChange(index,property,newValues){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }
    function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }
    return(
        <Layout>
            <div className="h-screen">
            <h1>Categories</h1>
            <label>
                {editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category' }
            

            <form onSubmit={saveCategory}>
             <div className="flex gap-1">

             <input 
            id="categoryName"
            type="text" 
            placeholder={'Category name'} 
            onChange={ev => setName(ev.target.value)}
            value={name}/>

            <select 
                id="parentCategory"
                onChange={ev => setParentCategory(ev.target.value)}
                value={parentCategory}>

                <option value="">No parent category</option>
                {categories.length > 0 && categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
            </select>
             </div>

             <div className="mb-2">
                <label className="block">Properties</label>
                   <button 
                   onClick={addProperty}
                   type="button" 
                   className="btn-primary text-sm mb-2">
                    Add new property 
                   </button>
                   {properties.length > 0 && properties.map((property,index) => (
                    <div key={index} className="flex gap-1 mb-2">
                        <input type="text" 
                               value={property.name} 
                               className="mb-0"
                               onChange={ev => handlePropertyNameChange(index,property, ev.target.value)}
                               placeholder="Property name (example: color)"/>
                        <input type="text"
                               className="mb-0"
                               onChange={ev => handlePropertyValuesChange(
                                index,
                                property,ev.target.value
                                )}
                               value={property.values} 
                               placeholder="Values, comma separated"/>
                        <button 
                               onClick={ ()=> removeProperty(index)}
                               type="button"
                               className="btn-red">
                               Remove
                        </button>
                    </div>
                   ))}
             </div>
             <div className="flex gap-1">
             {editedCategory && (
                <button 
                    type="button"
                    onClick={() => {
                        setEditedCategory(null);
                        setName('');
                        setParentCategory('');
                        setProperties([]);
                    }}
                    className="btn-red">
                    Cancel
                </button>
             )}
            
            <button type='submit' className="btn-primary py-1">Save</button>
             </div>
             
            </form>
            </label>
            {!editedCategory && (
                <table className="basic mt-4">
                <thead>
                    <tr>
                        <td className="theadleft">Category name</td>
                        <td>Parent category</td>
                        <td className="theadright">Options</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <div className="flex">
                                <button 
                                onClick={() => editCategory(category)} 
                                className="btn-primary mr-1">
                                Edit
                                </button>
                                <button 
                                onClick={() => deleteCategory(category)}
                                className="btn-red">
                                Delete
                                </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            </div>
        </Layout>
    );
}


export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
));