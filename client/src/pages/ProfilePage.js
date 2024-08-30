import React, { useState, useEffect } from 'react';
import {ProfileForm} from '../components/ProfileForm';
import { FavoritesComponent } from '../components/FavoritesComponent';

const ProfilePage = () => {
  return (
    <div className='profile-background'>
      <div className='profile-component'>
      <ProfileForm></ProfileForm>
      </div>
      <div className='favorites'>
      <FavoritesComponent/>
      </div>
    </div>
  );
};

export {ProfilePage} ;